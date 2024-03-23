import { FindResponse, QueryInput, SearchResponse, Sort } from "../../../types/repository.type";

export default interface IRepository<T> {
    save: (entity: T) => Promise<T>;
    findAll: <U>(query: QueryInput<T>, sort: Sort<U>) => Promise<FindResponse<T>>;
    search: <U>(term: string, sort: Sort<U>) => Promise<SearchResponse<T>>;
}

