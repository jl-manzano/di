import { Container } from "inversify";
import "reflect-metadata";
import { PersonasRepository } from "../Data/personasRepository";
import { IRepositoryPersonas } from "../Domain/Interfaces/IRepositoryPersonas";
import { PeopleListVM } from "../UI/viewmodels/PeopleListVM";

const TYPES = {
    IRepositoryPersonas: Symbol.for("IRepositoryPersonas"),
    IndexVM: Symbol.for("IndexVM"),
};

const container = new Container();

// Vinculamos la interfaz con su implementación concreta
container.bind<IRepositoryPersonas>(TYPES.IRepositoryPersonas).to(PersonasRepository);
container.bind<PeopleListVM>(TYPES.IndexVM).to(PeopleListVM);

export { container, TYPES };
