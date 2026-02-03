import { inject, injectable } from 'inversify';
import { makeAutoObservable, runInAction } from 'mobx';

import { TYPES } from '../../core/types';
import { GameState } from '../../domain/entities/GameState';
import { Player } from '../../domain/entities/Player';
import { Room } from '../../domain/entities/Room';

import { IGameRepository } from '../../domain/interfaces/IGameRepository';
import { IGameUseCases } from '../../domain/interfaces/IGameUseCases';
import { IRoomRepository } from '../../domain/interfaces/IRoomRepository';

type Unsub = () => void;

@injectable()
export class GameViewModel {
  gameState: GameState = new GameState();
  rooms: Room[] = [];

  isConnected = false;
  isLoadingRooms = false;

  showCreateRoomModal = false;

  mySymbol: string | null = null;

  private unsubs: Unsub[] = [];

  constructor(
    @inject(TYPES.IGameRepository) private readonly gameRepo: IGameRepository,
    @inject(TYPES.IRoomRepository) private readonly roomRepo: IRoomRepository,
    @inject(TYPES.IGameUseCases) private readonly useCases: IGameUseCases
  ) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get isMyTurn(): boolean {
    return !!this.mySymbol && this.gameState.currentTurn === this.mySymbol;
  }

  async initialize(): Promise<void> {
    this.showCreateRoomModal = false;

    await this.connect();

    await this.refreshRooms();
  }

  async connect(): Promise<void> {
    await this.gameRepo.connect();

    runInAction(() => {
      this.isConnected = this.gameRepo.isConnected();
    });

    this.clearSubscriptions();

    this.unsubs.push(
      this.gameRepo.onPlayerJoined((ev) => {
        runInAction(() => {
          const myConnId = this.gameRepo.getConnectionId();
          if (myConnId && ev.connectionId === myConnId) {
            this.mySymbol = ev.symbol;
          }

          const p = Player.fromJSON({
            connectionId: ev.connectionId,
            symbol: ev.symbol,
            playerName: ev.playerName,
          });

          if (ev.symbol === 'X') this.gameState.playerX = p;
          if (ev.symbol === 'O') this.gameState.playerO = p;
        });
      })
    );

    this.unsubs.push(
      this.gameRepo.onMoveMade((ev) => {
        runInAction(() => {
          const symbolToApply = this.gameState.currentTurn;
          this.gameState.makeMove(ev.position, symbolToApply);
        });
      })
    );

    this.unsubs.push(
      this.gameRepo.onGameReset(() => {
        runInAction(() => {
          this.gameState.reset();
        });
      })
    );

    this.unsubs.push(
      this.gameRepo.onOpponentDisconnected(() => {
        runInAction(() => {
          this.dropOpponent();
          this.gameState.reset();
        });
      })
    );

    this.unsubs.push(
      this.gameRepo.onOpponentLeft(() => {
        runInAction(() => {
          this.dropOpponent();
          this.gameState.reset();
        });
      })
    );

    this.unsubs.push(
      this.roomRepo.onRoomListUpdated((rooms) => {
        runInAction(() => {
          this.rooms = rooms;
          this.isLoadingRooms = false;
        });
      })
    );
  }

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

  async handleCellPress(position: number): Promise<void> {
    const result = await this.useCases.makeMove(position, this.gameState, this.mySymbol);

    if (!result.success) {
      console.warn('Movimiento inválido:', result.error);
    }

  }

  async resetGame(): Promise<void> {
    await this.useCases.resetGame();
  }

  async createRoom(roomName: string): Promise<void> {
    await this.useCases.createRoom(roomName);
  }

  async joinRoom(roomId: string): Promise<void> {
    await this.useCases.joinRoom(roomId, 'Jugador');
  }

  async leaveRoom(): Promise<void> {
    await this.useCases.leaveRoom();
  }

  async refreshRooms(): Promise<void> {
    runInAction(() => {
      this.isLoadingRooms = true;
    });

    await this.useCases.getRoomList();
  }

  private dropOpponent(): void {
    if (!this.mySymbol) {
      this.gameState.playerX = null;
      this.gameState.playerO = null;
      return;
    }

    if (this.mySymbol === 'X') this.gameState.playerO = null;
    if (this.mySymbol === 'O') this.gameState.playerX = null;
  }

  private clearSubscriptions(): void {
    this.unsubs.forEach((u) => u());
    this.unsubs = [];
  }
}
