import { RepositoryPersonas } from  '../models/data/RepositoryPersona'

export class IndexVM {
    static getPersonas() {
        return RepositoryPersonas.getPersonas();
    }

    static getPersonaById(id: number) {
        const personas = RepositoryPersonas.getPersonas();
        return personas.find(p => p.id === id);
    }
}