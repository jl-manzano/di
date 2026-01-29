export class Player {
  connectionId: string;
  symbol: string; // "X" o "O"
  name: string;

  constructor(connectionId: string, symbol: string, name: string) {
    this.connectionId = connectionId || '';
    this.symbol = symbol || '';
    this.name = name || 'Jugador';
  }

  static fromJSON(json: any): Player {
    if (!json) {
      return new Player('', '', 'Jugador');
    }

    return new Player(
      json.connectionId || json.ConnectionId || '',
      json.symbol || json.Symbol || '',
      json.name || json.Name || 'Jugador'
    );
  }

  toJSON(): object {
    return {
      connectionId: this.connectionId,
      symbol: this.symbol,
      name: this.name
    };
  }

  isValid(): boolean {
    return this.connectionId.length > 0 && this.symbol.length > 0;
  }
}