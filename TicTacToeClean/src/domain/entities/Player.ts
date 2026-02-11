/**
 * @file Player.ts
 * @summary Entidad de dominio que representa un jugador en el juego.
 * 
 * Contiene la información esencial de identidad y estado del jugador,
 * incluyendo su conexión al servidor, símbolo asignado y nombre.
 * Proporciona métodos para serialización/deserialización JSON
 * compatibles con el backend en C#.
 * 
 * Propiedades principales:
 * - connectionId: Identificador único de la conexión SignalR
 * - symbol: Símbolo asignado en el juego ('X' o 'O')
 * - name: Nombre visible del jugador
 */

export class Player {
  private _connectionId: string;
  private _symbol: string; // "X" o "O"
  private _name: string;

  /**
   * Crea una nueva instancia de Player.
   * 
   * @param connectionId - ID de conexión SignalR del jugador
   * @param symbol - Símbolo asignado ('X' o 'O')
   * @param name - Nombre del jugador
   */
  constructor(connectionId: string, symbol: string, name: string) {
    this._connectionId = connectionId || '';
    this._symbol = symbol || '';
    this._name = name || 'Jugador';
  }

  // Getters públicos para acceso controlado

  /** ID único de la conexión SignalR */
  get connectionId(): string {
    return this._connectionId;
  }

  /** Símbolo asignado al jugador ('X' o 'O') */
  get symbol(): string {
    return this._symbol;
  }

  /** Nombre visible del jugador */
  get name(): string {
    return this._name;
  }

  // Setters para permitir mutación controlada

  set connectionId(value: string) {
    this._connectionId = value;
  }

  set symbol(value: string) {
    this._symbol = value;
  }

  set name(value: string) {
    this._name = value;
  }

  /**
   * Deserializa un objeto JSON en una instancia de Player.
   * Soporta tanto camelCase como PascalCase para compatibilidad con C#.
   * 
   * @param json - Objeto JSON con los datos del jugador
   * @returns Nueva instancia de Player
   * 
   * @example
   * // Desde respuesta del servidor C#
   * const player = Player.fromJSON({ ConnectionId: 'abc', Symbol: 'X', Name: 'Juan' });
   */
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

  /**
   * Serializa el jugador a formato JSON.
   * 
   * @returns Objeto JSON con los datos del jugador
   */
  toJSON(): object {
    return {
      connectionId: this._connectionId,
      symbol: this._symbol,
      name: this._name
    };
  }

  /**
   * Verifica si el jugador tiene datos válidos.
   * Un jugador es válido si tiene connectionId y símbolo asignado.
   * 
   * @returns true si el jugador es válido, false en caso contrario
   */
  isValid(): boolean {
    return this._connectionId.length > 0 && this._symbol.length > 0;
  }
}