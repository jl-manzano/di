/**
 * DOMAIN LAYER - Entidad de Dominio
 */
export class clsMensajeUsuario {
  usuario: string;
  mensaje: string;

  constructor(usuario: string, mensaje: string) {
    this.usuario = usuario;
    this.mensaje = mensaje;
  }

  static fromJSON(json: any): clsMensajeUsuario {
    return new clsMensajeUsuario(
      json.usuario || '',
      json.mensaje || ''
    );
  }

  toJSON(): object {
    return {
      usuario: this.usuario,
      mensaje: this.mensaje
    };
  }

  isValid(): boolean {
    return this.mensaje.trim().length > 0;
  }

  getUsuarioOAnonimo(): string {
    return this.usuario.trim() || 'Anónimo';
  }
}