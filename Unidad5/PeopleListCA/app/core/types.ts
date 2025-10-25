import { GetPeopleListUC } from "../domain/usecases/GetPeopleListUC";

const TYPES = {
    IRepositoryPersonas: Symbol.for("IRepositoryPersonas"),
    GetPeopleListUC: Symbol.for("GetPeopleListUC"),
    IndexVM: Symbol.for("IndexVM"),
};
export { TYPES };