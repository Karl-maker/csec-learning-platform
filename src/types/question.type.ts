import { Prisma } from "@prisma/client";
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
export type QuestionFilter = {
    topics: string[];
}
export type QuestionModel = {
    id: number;
    name: string;
    description: string;
    tier_level: number;
    created_at: Date;
    content: {
        id: number;
        text: string | null;
        url: string | null;
        key: string | null;
        alt: string | null;
        type: string;
        question_id: number;
        created_at: Date;
    }[];
    multiple_choice_answers: {
        id: number;
        text: string | null;
        url: string | null;
        alt: string | null;
        key: string | null;
        type: string;
        correct: boolean;
        question_id: number;
        created_at: Date;
    }[];
    hints?: ({
        hint: {
            id: number;
            text: string | null;
            url: string | null;
            key: string | null;
            alt: string | null;
            type: string;
            created_at: Date;
        };
    } & {
        hint_id: number;
        question_id: number;
        assigned_at: Date;
    })[];
    topics?: ({
        topic: {
            id: number;
            name: string;
            description: string;
            created_at: Date;
        };
    } & {
        question_id: number;
        topic_id: number;
        assigned_at: Date;
    })[];
};
const QuestionPrismaModel = Prisma.validator<Prisma.QuestionDefaultArgs>()({
    include: { content: true, topics: { include: { topic: true } }, hints: { include: { hint: true } }, multiple_choice_answers: true },
})

export type QuestionPrismaModelType = typeof QuestionPrismaModel;