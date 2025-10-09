import { RepositoryPersonas } from  '../models/data/RepositoryPersona'

export class IndexVM {
    static getPersonas() {
        return RepositoryPersonas.getPersonas();
    }
}