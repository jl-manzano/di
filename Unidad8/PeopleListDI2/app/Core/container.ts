import { Container } from "inversify";
import "reflect-metadata";
import { TYPES } from "./types";

// Asumiendo que estas son las rutas correctas para el repositorio de la API
import { PersonasRepository } from "../Data/personasRepository"; 
import { IPersonasRepository } from "../Domain/Interfaces/IPersonasRepository"

import { PersonasUseCases } from "../Domain/UseCases/PersonasUseCases";
import { IPersonasUseCases } from "../Domain/Interfaces/IPersonasUseCases";

import { PeopleListVM } from "../UI/ViewModels/PeopleListVM";

const container = new Container();

container.bind<IPersonasRepository>(TYPES.IPersonasRepository).to(PersonasRepository);

container.bind<IPersonasUseCases>(TYPES.IPersonasUseCases).to(PersonasUseCases);

container.bind<PeopleListVM>(TYPES.PeopleListVM).to(PeopleListVM);

export { container };

// NOTA: La definición de TYPES se ELIMINA de este archivo.