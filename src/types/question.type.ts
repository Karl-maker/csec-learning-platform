import Question from "../entity/question/question.entity";
import { Content } from "./utils.type";

export type QuestionType = {
    id: number | string;
    name: string;
    description: string;
    content: Content[];
    multiple_choices?: QuestionMultipleChoiceType[];
    topics: QuestionTopicsType[];
    tips: Content[];
    tier_level: number;
}
export type QuestionBeforeSavedType = Omit<QuestionType, 'id'>;
export type QuestionMultipleChoiceType = {
    is_correct: boolean;
    content: Content;
}
export type QuestionTopicsType = {
    name: string;
}
export type CreateQuestionUseCaseResponse = {
    question?: Question;
    success: boolean;
    message?: string;
}