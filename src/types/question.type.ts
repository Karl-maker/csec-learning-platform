import Question from "../entity/question/question.entity";
import { ConnectById } from "./repository.type";
import { Content } from "./utils.type";

export type QuestionType = {
    id: number;
    name: string;
    description: string;
    content: Content[];
    multiple_choices?: QuestionMultipleChoiceType[];
    topics: QuestionTopicsType[];
    tips?: TipType[];
    tier_level: number;
}
export type QuestionBeforeSavedType = Omit<QuestionType, 'id'>;
export type QuestionMultipleChoiceType = {
    is_correct: boolean;
    content: Content;
}
export type QuestionTopicsType = {
    id?: number;
    name: string;
    description: string;
}
export type CreateQuestionUseCaseResponse = {
    question?: Question;
    success: boolean;
    message?: string;
}

export type TipType = Content;