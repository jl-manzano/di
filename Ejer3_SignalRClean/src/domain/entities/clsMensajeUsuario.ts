/**
 * DOMAIN LAYER - Entidad de Dominio
 */
export class clsMensajeUsuario {
  usuario: string;
  mensaje: string;

  constructor(usuario: string, mensaje: string) {
    this.usuario = usuario || 'Anónimo';
    this.mensaje = mensaje || '';
  }

  static fromJSON(json: any): clsMensajeUsuario {
    if (!json) {
      console.warn('⚠️ JSON null/undefined recibido en fromJSON');
      return new clsMensajeUsuario('Anónimo', '');
    }

    return new clsMensajeUsuario(
      json.usuario || json.Usuario || 'Anónimo',
      json.mensaje || json.Mensaje || ''
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