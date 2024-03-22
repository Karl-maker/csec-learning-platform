export type Content = {
    type: ContentType;
    url?: string;
    text?: string;
}
export type ContentType = 'video' | 'audio' | 'image' | 'text' | '3d';
