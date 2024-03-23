export default interface IUploadRepository {
    upload(data: Buffer): Promise<UploadResponse>;
    remove(key: string, ext?: string): Promise<void>;
}

export type UploadResponse = {
    location: string;
    key: string;
    ext: string;
}