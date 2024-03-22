import { FindResponse, QueryInput, Sort } from "../../../types/repository.type";

export default interface IRepository<T> {
    save: (entity: T) => Promise<T>;
    findAll: <U>(query: QueryInput<T>, sort: Sort<U>) => Promise<FindResponse<T>>;
}

