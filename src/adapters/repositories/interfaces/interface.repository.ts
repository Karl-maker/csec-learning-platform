import { FindResponse, QueryInput, SearchResponse, Sort } from "../../../types/repository.type";

export default interface IRepository<Entity>  {
    save:(entity: Entity) => Promise<Entity>;
    find:<SortInput>(query: QueryInput<Entity>, sort: Sort<SortInput>) => Promise<FindResponse<Entity>>;
    search:<DataType>(term: string, sort: Sort<DataType>) => Promise<SearchResponse<Entity>>;
    fitEntityToModelCreateQuery:(entity: Entity) => any; 
    fitEntityToModelUpdateQuery:(entity: Entity) => any; 
    fitModelToEntity:(model: any) => Entity;
}


