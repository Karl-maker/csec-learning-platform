import { FindResponse, QueryInput, SearchResponse, Sort } from "../../../types/repository.type";

export default interface IRepository<Entity> extends IReadOnlyRepository<Entity> {
    updateById:<DataType>(id: number, data: Partial<DataType>) => Promise<Entity>;
}

export interface IReadOnlyRepository<Entity> {
    save:(entity: Entity) => Promise<Entity>;
    findAll:<SortInput>(query: QueryInput<Entity>, sort: Sort<SortInput>) => Promise<FindResponse<Entity>>;
    search:<DataType>(term: string, sort: Sort<DataType>) => Promise<SearchResponse<Entity>>;
    fitEntityToModelCreateQuery:(entity: Entity) => any; 
    fitModelToEntity:(model: any) => Entity;
}


