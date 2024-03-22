export type Content = {
    id?: number;
    type: ContentType;
    url?: string;
    text?: string;
}
export type ContentType = 'video' | 'audio' | 'image' | 'text' | '3d';
