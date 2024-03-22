export type Sort<T> = {
    page: {
        number: number;
        size: number;
    };
    field: {
        order: 'asc' | 'desc';
        key: keyof T
    }
} 
export type MutatedData = {
    affected: number;
}
export type FoundData<T> = {
    data: T[];
    amount: number;
}
export type ConnectById = {
    id: number;
}