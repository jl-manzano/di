// core/container.ts
import { Container } from "inversify";
import { TYPES } from "./types";
import { IPokemonRepository } from "../domain/interfaces/IPokemonRepository";
import { IPokemonUseCases } from "../domain/interfaces/IPokemonUseCases";
import { PokemonRepository } from "../data/repositories/PokemonRepository";
import { PokemonUseCases } from "../domain/usecases/PokemonUseCases";
import { PokemonViewModel } from "../vm/PokemonVM";

// Creamos el contenedor de Inversify
const container = new Container();

// Vinculamos las interfaces con las implementaciones correspondientes
container.bind<IPokemonRepository>(TYPES.IPokemonRepository).to(PokemonRepository);
container.bind<IPokemonUseCases>(TYPES.IPokemonUseCases).to(PokemonUseCases);
container.bind<PokemonViewModel>(TYPES.PokemonViewModel).to(PokemonViewModel);

// Exportamos el contenedor para su uso en la aplicación
export { container };
