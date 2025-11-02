import { Container } from "inversify";
import "reflect-metadata";
import { PersonasRepository, HundredPersonasRepository, EmptyPersonasRepository } from "../data/repositories/repositoryPersona";
import { IRepositoryPersonas } from "../domain/interfaces/IRepositoryPersonas";
import { PeopleListVM } from "../presentation/viewmodels/PeopleListVM";
import { GetPeopleListUC } from "../domain/usecases/GetPeopleListUC";
import { TYPES } from "./types";

const container = new Container();

// Vinculamos la interfaz con su implementación concreta
container.bind<IRepositoryPersonas>(TYPES.IRepositoryPersonas).to(PersonasRepository);
container.bind<GetPeopleListUC>(TYPES.GetPeopleListUC).to(GetPeopleListUC);
container.bind<PeopleListVM>(TYPES.IndexVM).to(PeopleListVM);
export { container };