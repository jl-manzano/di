import { makeAutoObservable, runInAction } from "mobx";
import { inject, injectable } from "inversify";
import { TYPES } from "../../Core/types";
import { IPersonasUseCases } from "../../Domain/Interfaces/Persona/IPersonasUseCases";
import { IDomainToUI } from "../Mappers/IDomainToUI";
import { PersonaConColor } from "../Models/PersonaConColor";

@injectable()
export class JuegoVM {
  private _personasConColor: PersonaConColor[] = [];
  private _selecciones: Map<number, number> = new Map();
  private _mensaje: string = "";
  private _tipoMensaje: "success" | "warning" | "" = "";
  private _isLoading: boolean = false;

  private _resetKey: number = 0;

  constructor(
    @inject(TYPES.IPersonasUseCases) private personasUseCases: IPersonasUseCases,
    @inject(TYPES.IDomainToUI) private mapper: IDomainToUI
  ) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get personasConColor(): PersonaConColor[] {
    return this._personasConColor;
  }

  get mensaje(): string {
    return this._mensaje;
  }

  get tipoMensaje(): "success" | "warning" | "" {
    return this._tipoMensaje;
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  get resetKey(): number {
    return this._resetKey;
  }

  get todasSeleccionadas(): boolean {
    if (this._personasConColor.length === 0) return false;
    return this._selecciones.size === this._personasConColor.length;
  }

  async cargarPersonas(): Promise<void> {
    this._isLoading = true;

    try {
      const personasConListado = await this.personasUseCases.getPersonas();

      const personasUI: PersonaConColor[] = [];
      for (let i = 0; i < personasConListado.length; i++) {
        personasUI.push(this.mapper.transformar(personasConListado[i]));
      }

      runInAction(() => {
        this._personasConColor = personasUI;
        this._isLoading = false;
        this._mensaje = "";
        this._tipoMensaje = "";
        this._selecciones.clear();
        this._resetKey++;
      });
    } catch (error) {
      console.error("❌ Error al cargar los datos:", error);
      runInAction(() => {
        this._isLoading = false;
        this._mensaje = "Error al cargar los datos";
        this._tipoMensaje = "warning";
      });
    }
  }

  handleSeleccion(personaId: number, departamentoId: unknown): void {
    const dep: number = Number(departamentoId);
    if (!Number.isFinite(dep)) return;

    this._selecciones.set(personaId, dep);
  }

  async handleComprobar(): Promise<void> {
    try {
      const total: number = this._personasConColor.length;

      if (total === 0) {
        runInAction(() => {
          this._mensaje = "No hay personas para comprobar";
          this._tipoMensaje = "warning";
        });
        return;
      }

      let aciertos: number = 0;
      let seleccionadas: number = 0;

      for (let i = 0; i < this._personasConColor.length; i++) {
        const personaColor: PersonaConColor | undefined = this._personasConColor[i];
        if (!personaColor) continue;

        const persona: any = (personaColor as any).persona;
        if (!persona) continue;

        const personaIdRaw: any = persona.id ?? persona.Id;
        const personaId: number = Number(personaIdRaw);
        if (!Number.isFinite(personaId) || personaId <= 0) continue;

        const seleccionadoRaw: number | undefined = this._selecciones.get(personaId);
        const correctoRaw: any = persona.idDepartamento ?? persona.IdDepartamento;

        const seleccionado: number = Number(seleccionadoRaw);
        const correcto: number = Number(correctoRaw);

        if (Number.isFinite(seleccionado) && seleccionado > 0) {
          seleccionadas++;

          if (Number.isFinite(correcto) && correcto > 0) {
            if (seleccionado === correcto) {
              aciertos++;
            }
          }
        }
      }

      const faltan: number = total - seleccionadas;

      runInAction(() => {
        if (faltan > 0) {
          this._mensaje =
            `Has acertado ${aciertos} de ${seleccionadas} seleccionadas. ` +
            `Te faltan ${faltan} por seleccionar.`;
          this._tipoMensaje = "warning";
          return;
        }

        if (aciertos === total) {
          this._mensaje = "¡Enhorabuena! ¡Has acertado todos los departamentos! 🎉";
          this._tipoMensaje = "success";
        } else {
          this._mensaje = `Has acertado ${aciertos} de ${total} departamentos. ¡Inténtalo de nuevo!`;
          this._tipoMensaje = "warning";

          this._selecciones.clear();
          this._resetKey++;
        }
      });
    } catch (error) {
      console.error("❌ Error al comprobar las respuestas:", error);
      runInAction(() => {
        this._mensaje = "Error al comprobar las respuestas";
        this._tipoMensaje = "warning";
      });
    }
  }
}
