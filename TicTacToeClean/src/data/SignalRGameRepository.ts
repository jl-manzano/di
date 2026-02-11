/**
 * @file SignalRGameRepository.ts
 * @summary Repositorio que implementa la comunicación del juego vía SignalR.
 * 
 * Implementa IGameRepository utilizando SignalR como protocolo de
 * comunicación en tiempo real. Gestiona los eventos del juego:
 * movimientos, reset, conexión/desconexión de jugadores.
 * 
 * Eventos del servidor manejados:
 * - PlayerJoined: Un jugador se unió a la partida
 * - MoveBroadcasted: Se realizó un movimiento en el tablero
 * - ResetBroadcasted: El juego fue reiniciado
 * - OpponentDisconnected: El oponente perdió conexión inesperadamente
 * - OpponentLeft: El oponente abandonó la sala voluntariamente
 * 
 * Métodos del hub invocados:
 * - BroadcastMove: Envía un movimiento al servidor
 * - BroadcastReset: Solicita reinicio del juego
 * 
 * Características:
 * - Normalización de respuestas (soporta camelCase y PascalCase)
 * - Patrón de suscripción/desuscripción para manejo de eventos
 * - Validación de conexión antes de operaciones
 */

import { inject, injectable } from 'inversify';
import { TYPES } from '../core/types';

import { SignalRConnection } from '../data/SignalRConnection';
import {
    GameResetEvent,
    IGameRepository,
    MoveMadeEvent,
    PlayerJoinedEvent,
    Unsubscribe
} from '../domain/interfaces/IGameRepository';

@injectable()
export class SignalRGameRepository implements IGameRepository {
  /** Handlers suscritos al evento PlayerJoined */
  private playerJoinedHandlers: Array<(e: PlayerJoinedEvent) => void> = [];
  /** Handlers suscritos al evento MoveMade */
  private moveMadeHandlers: Array<(e: MoveMadeEvent) => void> = [];
  /** Handlers suscritos al evento GameReset */
  private gameResetHandlers: Array<(e: GameResetEvent) => void> = [];
  /** Handlers suscritos al evento OpponentDisconnected */
  private opponentDisconnectedHandlers: Array<() => void> = [];
  /** Handlers suscritos al evento OpponentLeft */
  private opponentLeftHandlers: Array<() => void> = [];

  /**
   * Handlers bound para los eventos del servidor.
   * Normalizan la respuesta del servidor (soportando tanto camelCase
   * como PascalCase para compatibilidad con backend C#) y notifican
   * a todos los handlers suscritos.
   */
  private bound = {
    /** Procesa evento de jugador unido */
    PlayerJoined: (data: any) => {
      const ev: PlayerJoinedEvent = {
        connectionId: data.connectionId || data.ConnectionId || '',
        symbol: data.symbol || data.Symbol || '',
        playerName: data.playerName || data.PlayerName || 'Jugador',
        playerCount: data.playerCount || data.PlayerCount || 0,
      };
      this.playerJoinedHandlers.forEach((h) => h(ev));
    },
    /** Procesa evento de movimiento realizado */
    MoveBroadcasted: (data: any) => {
      const ev: MoveMadeEvent = {
        connectionId: data.connectionId || data.ConnectionId || '',
        position: data.position || data.Position || 0,
      };
      this.moveMadeHandlers.forEach((h) => h(ev));
    },
    /** Procesa evento de juego reiniciado */
    ResetBroadcasted: (data: any) => {
      const ev: GameResetEvent = {
        connectionId: data.connectionId || data.ConnectionId || '',
      };
      this.gameResetHandlers.forEach((h) => h(ev));
    },
    /** Procesa evento de oponente desconectado */
    OpponentDisconnected: () => {
      this.opponentDisconnectedHandlers.forEach((h) => h());
    },
    /** Procesa evento de oponente que abandonó */
    OpponentLeft: () => {
      this.opponentLeftHandlers.forEach((h) => h());
    },
  };

  /**
   * Crea una nueva instancia del repositorio.
   * 
   * @param conn - Conexión SignalR compartida inyectada desde el contenedor
   */
  constructor(
    @inject(TYPES.SignalRConnection) private readonly conn: SignalRConnection
  ) {}

  /**
   * Conecta al servidor y registra los listeners de eventos del juego.
   * Los eventos se procesan a través de los handlers bound para normalización.
   */
  async connect(): Promise<void> {
    await this.conn.connect();

    this.conn.on('PlayerJoined', this.bound.PlayerJoined);
    this.conn.on('MoveBroadcasted', this.bound.MoveBroadcasted);
    this.conn.on('ResetBroadcasted', this.bound.ResetBroadcasted);
    this.conn.on('OpponentDisconnected', this.bound.OpponentDisconnected);
    this.conn.on('OpponentLeft', this.bound.OpponentLeft);
  }

  /**
   * Desconecta del servidor y elimina todos los listeners de eventos.
   * Asegura limpieza correcta de recursos.
   */
  async disconnect(): Promise<void> {
    if (this.conn.isConnected()) {
      this.conn.off('PlayerJoined', this.bound.PlayerJoined);
      this.conn.off('MoveBroadcasted', this.bound.MoveBroadcasted);
      this.conn.off('ResetBroadcasted', this.bound.ResetBroadcasted);
      this.conn.off('OpponentDisconnected', this.bound.OpponentDisconnected);
      this.conn.off('OpponentLeft', this.bound.OpponentLeft);
    }

    await this.conn.disconnect();
  }

  /**
   * Verifica si hay conexión activa con el servidor.
   * 
   * @returns true si está conectado, false en caso contrario
   */
  isConnected(): boolean {
    return this.conn.isConnected();
  }

  /**
   * Obtiene el ID de conexión asignado por el servidor.
   * 
   * @returns ID de conexión o null si no está conectado
   */
  getConnectionId(): string | null {
    return this.conn.getConnectionId();
  }

  /**
   * Envía un movimiento al servidor para ser broadcast a todos los jugadores.
   * 
   * @param position - Posición del tablero (0-8)
   * @throws Error si no hay conexión activa
   * @throws Error si la posición es inválida
   */
  async sendMove(position: number): Promise<void> {
    if (!this.conn.isConnected()) throw new Error('No hay conexión activa con el servidor');
    if (position < 0 || position > 8) throw new Error('Posición inválida');

    await this.conn.invoke('BroadcastMove', position);
  }

  /**
   * Envía solicitud de reinicio al servidor.
   * El servidor notificará a ambos jugadores con ResetBroadcasted.
   * 
   * @throws Error si no hay conexión activa
   */
  async sendReset(): Promise<void> {
    if (!this.conn.isConnected()) throw new Error('No hay conexión activa con el servidor');
    await this.conn.invoke('BroadcastReset');
  }

  /**
   * Suscribe un handler al evento de jugador unido.
   * 
   * @param handler - Función que recibe el evento PlayerJoinedEvent
   * @returns Función para cancelar la suscripción
   */
  onPlayerJoined(handler: (e: PlayerJoinedEvent) => void): Unsubscribe {
    this.playerJoinedHandlers.push(handler);
    return () => (this.playerJoinedHandlers = this.playerJoinedHandlers.filter((h) => h !== handler));
  }

  /**
   * Suscribe un handler al evento de movimiento realizado.
   * 
   * @param handler - Función que recibe el evento MoveMadeEvent
   * @returns Función para cancelar la suscripción
   */
  onMoveMade(handler: (e: MoveMadeEvent) => void): Unsubscribe {
    this.moveMadeHandlers.push(handler);
    return () => (this.moveMadeHandlers = this.moveMadeHandlers.filter((h) => h !== handler));
  }

  /**
   * Suscribe un handler al evento de juego reiniciado.
   * 
   * @param handler - Función que recibe el evento GameResetEvent
   * @returns Función para cancelar la suscripción
   */
  onGameReset(handler: (e: GameResetEvent) => void): Unsubscribe {
    this.gameResetHandlers.push(handler);
    return () => (this.gameResetHandlers = this.gameResetHandlers.filter((h) => h !== handler));
  }

  /**
   * Suscribe un handler al evento de oponente desconectado.
   * Se dispara cuando el oponente pierde conexión inesperadamente.
   * 
   * @param handler - Función callback sin parámetros
   * @returns Función para cancelar la suscripción
   */
  onOpponentDisconnected(handler: () => void): Unsubscribe {
    this.opponentDisconnectedHandlers.push(handler);
    return () =>
      (this.opponentDisconnectedHandlers = this.opponentDisconnectedHandlers.filter((h) => h !== handler));
  }

  /**
   * Suscribe un handler al evento de oponente que abandonó.
   * Se dispara cuando el oponente abandona la sala voluntariamente.
   * 
   * @param handler - Función callback sin parámetros
   * @returns Función para cancelar la suscripción
   */
  onOpponentLeft(handler: () => void): Unsubscribe {
    this.opponentLeftHandlers.push(handler);
    return () => (this.opponentLeftHandlers = this.opponentLeftHandlers.filter((h) => h !== handler));
  }
}