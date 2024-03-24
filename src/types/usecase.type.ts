export type FindAllUseCaseResponse<DataType> = {
    data: DataType[];
    amount: number;
}
export type SearchUseCaseResponse<DataType> = {
    data: DataType[];
    amount: number;  
}
export type CreateUseCaseResponse<DataType> = {
    data?: DataType;
    success: boolean;
    message?: string;
}
export type UpdateUseCaseResponse<DataType> = {
    data?: DataType;
    success: boolean;
    message?: string;  
}