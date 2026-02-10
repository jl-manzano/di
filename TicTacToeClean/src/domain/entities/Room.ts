/**
 * Entidad de dominio que representa una sala de juego multijugador.
 * Encapsula las reglas de negocio relacionadas con la gestión de salas.
 */
export class Room {
  private _roomId: string;
  private _roomName: string;
  private _playerCount: number;
  private _maxPlayers: number;
  private _isFull: boolean;
  private _createdAt: Date;

  constructor(
    roomId: string = '',
    roomName: string = '',
    playerCount: number = 0,
    maxPlayers: number = 2,
    isFull: boolean = false,
    createdAt: Date = new Date()
  ) {
    this._roomId = roomId;
    this._roomName = roomName;
    this._playerCount = playerCount;
    this._maxPlayers = maxPlayers;
    this._isFull = isFull;
    this._createdAt = createdAt;
  }

  // Getters públicos para acceso controlado
  get roomId(): string {
    return this._roomId;
  }

  get roomName(): string {
    return this._roomName;
  }

  get playerCount(): number {
    return this._playerCount;
  }

  get maxPlayers(): number {
    return this._maxPlayers;
  }

  get isFull(): boolean {
    return this._isFull;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  // Setters para permitir mutación controlada
  set roomId(value: string) {
    this._roomId = value;
  }

  set roomName(value: string) {
    this._roomName = value;
  }

  set playerCount(value: number) {
    this._playerCount = value;
  }

  set maxPlayers(value: number) {
    this._maxPlayers = value;
  }

  set isFull(value: boolean) {
    this._isFull = value;
  }

  set createdAt(value: Date) {
    this._createdAt = value;
  }

  /**
   * Deserializa un objeto JSON en una instancia de Room.
   * @param json - Objeto JSON con los datos de la sala
   * @returns Nueva instancia de Room
   */
  static fromJSON(json: any): Room {
    if (!json) return new Room();
    
    return new Room(
      json.roomId || '',
      json.roomName || '',
      json.playerCount || 0,
      json.maxPlayers || 2,
      json.isFull || false,
      json.createdAt ? new Date(json.createdAt) : new Date()
    );
  }

  /**
   * Serializa la sala a formato JSON.
   * @returns Objeto JSON con los datos de la sala
   */
  toJSON(): object {
    return {
      roomId: this._roomId,
      roomName: this._roomName,
      playerCount: this._playerCount,
      maxPlayers: this._maxPlayers,
      isFull: this._isFull,
      createdAt: this._createdAt.toISOString()
    };
  }

  /**
   * Obtiene el texto que representa el conteo de jugadores.
   * @returns String en formato "actual/máximo" (ej: "1/2")
   */
  getPlayerCountText(): string {
    return `${this._playerCount}/${this._maxPlayers}`;
  }

  /**
   * Verifica si un jugador puede unirse a la sala.
   * @returns true si la sala no está llena, false en caso contrario
   */
  canJoin(): boolean {
    return !this._isFull;
  }
}