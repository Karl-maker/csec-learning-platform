export type FindAllUseCaseResponse<T> = {
    data: T[];
    amount: number;
}
export type SearchUseCaseResponse<T> = {
    data: T[];
    amount: number;  
}
export type CreateUseCaseResponse<T> = {
    data?: T;
    success: boolean;
    message?: string;
}
export type UpdateUseCaseResponse<T> = {
    data?: T;
    success: boolean;
    message?: string;  
}