import { Persona } from "@/app/Domain/Entities/Persona";
import { inject } from "inversify";
import { TYPES } from "../../Core/types";
import { IRepositoryPersonas } from "../../Domain/Interfaces/IRepositoryPersonas";
import {  makeAutoObservable } from "mobx";

export class PeopleListVM {


    private _personasList: Persona[] = [];
    private _personaSeleccionada: Persona;
   
  constructor(
        @inject(TYPES.IRepositoryPersonas)
        private RepositoryPersonas: IRepositoryPersonas
    ) {


       
        this._personaSeleccionada = new Persona(0, 'Sofyan', 'Amrabat');


        this._personasList = this.RepositoryPersonas.getListadoCompletoPersonas();
        makeAutoObservable(this);
     
    }


    public get personasList(): Persona[] {
        return this._personasList;
    }


    public get personaSeleccionada(): Persona {
        return this._personaSeleccionada;
    }


    public set personaSeleccionada(value: Persona) {
        this._personaSeleccionada = value;
        //alert(`Persona seleccionada en el VM: ${this._personaSeleccionada.nombre} ${this._personaSeleccionada.apellidos}`);
     
    }


  }
