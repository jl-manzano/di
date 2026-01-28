import { injectable, inject } from 'inversify';
import { makeAutoObservable, runInAction } from 'mobx';
import { GameState } from '../../domain/entities/GameState';
import { Room } from '../../domain/entities/Room';
import { IGameUseCases } from '../../domain/interfaces/IGameUseCases';
import { TYPES } from '../../core/types';

export type PlayerSymbol = 'X' | 'O' | null;

@injectable()
export class GameViewModel {
  gameState: GameState = new GameState();
  isConnected = false;
  errorMessage = '';

  connectionId: string | null = null;
  rooms: Room[] = [];
  showCreateRoomModal = false;
  isLoadingRooms = false;

  private gameUseCases: IGameUseCases;

  constructor(@inject(TYPES.IGameUseCases) gameUseCases: IGameUseCases) {
    this.gameUseCases = gameUseCases;
    makeAutoObservable(this);
  }

  async initialize(): Promise<void> {
    try {
      await this.gameUseCases.initializeConnection();

      runInAction(() => {
        this.isConnected = this.gameUseCases.isConnected();
        this.connectionId = this.gameUseCases.getConnectionId();
        this.errorMessage = '';
      });

      this.gameUseCases.onGameStateUpdated((state) => runInAction(() => this.gameState = state));
      this.gameUseCases.onRoomListUpdated((rooms) => runInAction(() => this.rooms = rooms));

      await this.refreshRooms();
    } catch (error: any) {
      runInAction(() => {
        this.isConnected = false;
        this.errorMessage = error.message;
      });
    }
  }

  get mySymbol(): PlayerSymbol {
    if (!this.connectionId) return null;
    if (this.gameState.playerX?.connectionId === this.connectionId) return 'X';
    if (this.gameState.playerO?.connectionId === this.connectionId) return 'O';
    return null;
  }

  get isMyTurn(): boolean {
    if (!this.mySymbol || this.gameState.gameOver || this.gameState.waitingForPlayer) return false;
    return this.gameState.currentTurn === this.mySymbol;
  }

  async handleCellPress(position: number) {
    if (!this.isMyTurn) return;
    try { await this.gameUseCases.makeMove(position); } 
    catch (error: any) { runInAction(() => this.errorMessage = error.message); }
  }

  async resetGame() {
    if (!this.isConnected) return;
    try { await this.gameUseCases.resetGame(); } 
    catch (error: any) { runInAction(() => this.errorMessage = error.message); }
  }

  async createRoom(name: string) { await this.gameUseCases.createRoom(name); }
  async joinRoom(id: string) { await this.gameUseCases.joinRoom(id); }

  async refreshRooms() {
    if (!this.isConnected) return;
    runInAction(() => this.isLoadingRooms = true);
    try {
      await this.gameUseCases.getRoomList();
      runInAction(() => this.isLoadingRooms = false);
    } catch (error: any) {
      runInAction(() => { this.isLoadingRooms = false; this.errorMessage = error.message; });
    }
  }

  async disconnect() {
    await this.gameUseCases.disconnect();
    runInAction(() => { this.isConnected = false; this.connectionId = null; });
  }
}
