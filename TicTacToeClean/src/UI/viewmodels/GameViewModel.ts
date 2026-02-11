/**
 * @file GameViewModel.ts
 * @summary ViewModel principal que gestiona el estado y lógica del juego.
 * 
 * Implementa el patrón MVVM actuando como intermediario entre la UI
 * y los casos de uso/repositorios. Utiliza MobX para estado reactivo
 * que actualiza automáticamente los componentes observadores.
 * 
 * Responsabilidades:
 * - Mantener el estado observable del juego (tablero, turnos, jugadores)
 * - Gestionar la conexión con el servidor
 * - Coordinar eventos en tiempo real (movimientos, reset, desconexiones)
 * - Exponer acciones para la UI (hacer movimiento, crear/unirse sala, etc.)
 * - Gestionar suscripciones a eventos del servidor
 * 
 * Estado observable:
 * - gameState: Estado completo del tablero y partida
 * - rooms: Lista de salas disponibles
 * - isConnected: Estado de conexión con el servidor
 * - mySymbol: Símbolo asignado al jugador local ('X' o 'O')
 */

import { inject, injectable } from 'inversify';
import { makeAutoObservable, runInAction } from 'mobx';

import { TYPES } from '../../core/types';
import { GameState } from '../../domain/entities/GameState';
import { Player } from '../../domain/entities/Player';
import { Room } from '../../domain/entities/Room';

import { IGameRepository } from '../../domain/interfaces/IGameRepository';
import { IGameUseCases } from '../../domain/interfaces/IGameUseCases';
import { IRoomRepository } from '../../domain/interfaces/IRoomRepository';

/** Tipo para funciones de cancelación de suscripción */
type Unsub = () => void;

@injectable()
export class GameViewModel {
  /** Estado completo del juego actual */
  gameState: GameState = new GameState();
  /** Lista de salas disponibles */
  rooms: Room[] = [];

  /** Indica si hay conexión activa con el servidor */
  isConnected = false;
  /** Indica si se está cargando la lista de salas */
  isLoadingRooms = false;

  /** Controla la visibilidad del modal de crear sala */
  showCreateRoomModal = false;

  /** Símbolo asignado al jugador local ('X' o 'O') */
  mySymbol: string | null = null;

  /** Lista de funciones para cancelar suscripciones a eventos */
  private unsubs: Unsub[] = [];

  /**
   * Crea una nueva instancia del ViewModel.
   * Configura MobX para reactividad automática con autoBind.
   * 
   * @param gameRepo - Repositorio para operaciones del juego
   * @param roomRepo - Repositorio para operaciones de salas
   * @param useCases - Casos de uso del juego
   */
  constructor(
    @inject(TYPES.IGameRepository) private readonly gameRepo: IGameRepository,
    @inject(TYPES.IRoomRepository) private readonly roomRepo: IRoomRepository,
    @inject(TYPES.IGameUseCases) private readonly useCases: IGameUseCases
  ) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  /**
   * Computed property que indica si es el turno del jugador local.
   * 
   * @returns true si el jugador tiene símbolo asignado y es su turno
   */
  get isMyTurn(): boolean {
    return !!this.mySymbol && this.gameState.currentTurn === this.mySymbol;
  }

  /**
   * Inicializa el ViewModel: conecta al servidor y carga las salas.
   * Debe llamarse al montar el componente principal.
   */
  async initialize(): Promise<void> {
    this.showCreateRoomModal = false;

    await this.connect();

    await this.refreshRooms();
  }

  /**
   * Establece la conexión con el servidor y configura todos los
   * listeners de eventos en tiempo real.
   * 
   * Eventos suscritos:
   * - PlayerJoined: Asigna símbolo y registra jugadores
   * - MoveMade: Aplica movimientos al tablero
   * - GameReset: Reinicia el estado del juego
   * - OpponentDisconnected/Left: Maneja desconexión del oponente
   * - RoomListUpdated: Actualiza lista de salas
   */
  async connect(): Promise<void> {
    await this.gameRepo.connect();

    runInAction(() => {
      this.isConnected = this.gameRepo.isConnected();
    });

    this.clearSubscriptions();

    // Suscripción: jugador se unió a la partida
    this.unsubs.push(
      this.gameRepo.onPlayerJoined((ev) => {
        runInAction(() => {
          const myConnId = this.gameRepo.getConnectionId();
          if (myConnId && ev.connectionId === myConnId) {
            this.mySymbol = ev.symbol;
          }

          const player = Player.fromJSON({
            connectionId: ev.connectionId,
            symbol: ev.symbol,
            playerName: ev.playerName,
          });

          this.gameState.assignPlayer(player);
        });
      })
    );

    // Suscripción: se realizó un movimiento
    this.unsubs.push(
      this.gameRepo.onMoveMade((ev) => {
        runInAction(() => {
          const symbolToApply = this.gameState.currentTurn;
          this.gameState.makeMove(ev.position, symbolToApply);
        });
      })
    );

    // Suscripción: juego reiniciado
    this.unsubs.push(
      this.gameRepo.onGameReset(() => {
        runInAction(() => {
          this.gameState.reset();
        });
      })
    );

    // Suscripción: oponente se desconectó
    this.unsubs.push(
      this.gameRepo.onOpponentDisconnected(() => {
        runInAction(() => {
          this.dropOpponent();
          this.gameState.reset();
        });
      })
    );

    // Suscripción: oponente abandonó la sala
    this.unsubs.push(
      this.gameRepo.onOpponentLeft(() => {
        runInAction(() => {
          this.dropOpponent();
          this.gameState.reset();
        });
      })
    );

    // Suscripción: lista de salas actualizada
    this.unsubs.push(
      this.roomRepo.onRoomListUpdated((rooms) => {
        runInAction(() => {
          this.rooms = rooms;
          this.isLoadingRooms = false;
        });
      })
    );
  }

  /**
   * Desconecta del servidor y limpia todo el estado.
   * Debe llamarse al desmontar el componente principal.
   */
  async disconnect(): Promise<void> {
    this.clearSubscriptions();

    await this.gameRepo.disconnect();

    runInAction(() => {
      this.isConnected = false;
      this.isLoadingRooms = false;
      this.showCreateRoomModal = false;

      this.rooms = [];
      this.mySymbol = null;
      this.gameState = new GameState();
    });
  }

  /**
   * Maneja el press en una celda del tablero.
   * Delega al caso de uso para validación y envío al servidor.
   * 
   * @param position - Índice de la celda (0-8)
   */
  async handleCellPress(position: number): Promise<void> {
    const result = await this.useCases.makeMove(position, this.gameState, this.mySymbol);

    if (!result.success) {
      console.warn('Movimiento inválido:', result.error);
    }
  }

  /**
   * Solicita reinicio del juego al servidor.
   * El reset se aplicará cuando llegue el evento ResetBroadcasted.
   */
  async resetGame(): Promise<void> {
    await this.useCases.resetGame();
  }

  /**
   * Crea una nueva sala de juego en el servidor.
   * 
   * @param roomName - Nombre para la nueva sala
   */
  async createRoom(roomName: string): Promise<void> {
    await this.useCases.createRoom(roomName);
  }

  /**
   * Une al jugador a una sala existente.
   * 
   * @param roomId - ID de la sala a unirse
   */
  async joinRoom(roomId: string): Promise<void> {
    await this.useCases.joinRoom(roomId, 'Jugador');
  }

  /**
   * Abandona la sala actual.
   */
  async leaveRoom(): Promise<void> {
    await this.useCases.leaveRoom();
  }

  /**
   * Solicita actualización de la lista de salas.
   * Activa el indicador de carga mientras espera respuesta.
   */
  async refreshRooms(): Promise<void> {
    runInAction(() => {
      this.isLoadingRooms = true;
    });

    await this.useCases.getRoomList();
  }

  /**
   * Elimina al oponente del estado cuando se desconecta o abandona.
   * Si no hay símbolo asignado, limpia ambos jugadores.
   */
  private dropOpponent(): void {
    if (!this.mySymbol) {
      this.gameState.clearPlayers();
      return;
    }

    const opponent = this.mySymbol === 'X' ? 'O' : 'X';
    this.gameState.removePlayer(opponent);
  }

  /**
   * Cancela todas las suscripciones activas a eventos del servidor.
   * Debe llamarse antes de reconectar o al desconectar.
   */
  private clearSubscriptions(): void {
    this.unsubs.forEach((u) => u());
    this.unsubs = [];
  }
}