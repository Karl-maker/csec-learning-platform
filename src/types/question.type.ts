import { Content } from "./utils.type";

export type QuestionType = {
    id: number | null;
    name: string;
    description: string;
    content: Content[];
    multiple_choices?: QuestionMultipleChoiceType[];
    topics: QuestionTopicsType[];
    tips?: TipType[];
    tier_level: number;
}
export type QuestionMultipleChoiceType = {
    id?: number;
    is_correct: boolean;
    content: Content;
}
export type QuestionTopicsType = {
    id?: number;
    name: string;
    description: string;
}
export type TipType = Content;
export type QuestionSortKeys = 'id' | 'created_at';