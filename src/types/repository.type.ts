export type Sort<T> = {
    page: {
        number: number;
        size: number;
    };
    field: {
        order: 'asc' | 'desc';
        key: T
    }
} 
export type MutatedData = {
    affected: number;
}
export type FindResponse<T> = {
    data: T[];
    amount: number;
}
export type SearchResponse<T> = {
    data: T[];
    amount: number;
}
export type QueryInput<Q> = Partial<Record<keyof Q, string[] | null>>;
export type ConnectById = {
    id: number;
}
export type FoundData<T> = {
    amount: number;
    data: T[];
}