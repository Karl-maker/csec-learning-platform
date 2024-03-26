import Question from "../entities/interfaces/interface.question.entity";

export type QuizType = {
    id: number | null;
    type: QuizTypes;
    tier_level: number;
    topics: {
        id: number;
        name?: string;
    }[];
    range: number;
    question_outline: {
        question_id: number
    }[];
}
export type QuizSortKeys = 'id' | 'created_at';
export type QuizTypes = 'generated' | 'manual';
export type QuizModel = {
    id: number;
    type: string;
    tier_level: number;
    created_at: Date;
    questions: {
        quiz_id: number;
        question_id: number;
        assigned_at: Date;
    }[];
    topics: {
        topic: {
            id: number;
            name: string;
            description: string;
            created_at: Date;
        };
    }[]
}