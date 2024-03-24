export type Sort<DataType> = {
    page: {
        number: number;
        size: number;
    };
    field: {
        order: 'asc' | 'desc';
        key: DataType
    }
} 
export type MutatedData = {
    affected: number;
}
export type FindResponse<DataType> = {
    data: DataType[];
    amount: number;
}
export type SearchResponse<DataType> = {
    data: DataType[];
    amount: number;
}
export type QueryInput<DataType> = Partial<Record<keyof DataType, string[] | null>>;
export type ConnectById = {
    id: number;
}
export type FoundData<DataType> = {
    amount: number;
    data: DataType[];
}