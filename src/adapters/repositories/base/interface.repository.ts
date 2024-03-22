import { FoundData, MutatedData, Sort } from "../../../types/repository.type";

export default interface IRepository<T> {
    save: (entity: T) => Promise<T>;
    // update: (where: Partial<T>, entity: T) => Promise<MutatedData>;
    // find: (where: Partial<T>, sort: Sort<T>) => Promise<FoundData<T>>;
    // delete: (where: Partial<T>) => Promise<MutatedData>;
}

