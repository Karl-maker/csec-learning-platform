export type Content = {
    id?: number;
    type: ContentType;
    url?: string;
    key?: string;
    text?: string;
    alt?: string;
}
export type ContentType = 'video' | 'audio' | 'image' | 'text' | '3d';
