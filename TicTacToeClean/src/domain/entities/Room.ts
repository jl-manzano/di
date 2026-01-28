export class Room {
  roomId: string;
  roomName: string;
  playerCount: number;
  maxPlayers: number;
  isFull: boolean;
  createdAt: Date;

  constructor(
    roomId: string = '',
    roomName: string = '',
    playerCount: number = 0,
    maxPlayers: number = 2,
    isFull: boolean = false,
    createdAt: Date = new Date()
  ) {
    this.roomId = roomId;
    this.roomName = roomName;
    this.playerCount = playerCount;
    this.maxPlayers = maxPlayers;
    this.isFull = isFull;
    this.createdAt = createdAt;
  }

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

  toJSON(): object {
    return {
      roomId: this.roomId,
      roomName: this.roomName,
      playerCount: this.playerCount,
      maxPlayers: this.maxPlayers,
      isFull: this.isFull,
      createdAt: this.createdAt.toISOString()
    };
  }

  getPlayerCountText(): string {
    return `${this.playerCount}/${this.maxPlayers}`;
  }

  canJoin(): boolean {
    return !this.isFull;
  }
}