import { FindResponse, QueryInput, SearchResponse, Sort } from "../../../types/repository.type";

export default interface IRepository<T> {
    save: (entity: T) => Promise<T>;
    findAll: <SortInput>(query: QueryInput<T>, sort: Sort<SortInput>) => Promise<FindResponse<T>>;
    search: <U>(term: string, sort: Sort<U>) => Promise<SearchResponse<T>>;
    updateById: <V>(id: number, data: Partial<V>) => Promise<T>;
}

