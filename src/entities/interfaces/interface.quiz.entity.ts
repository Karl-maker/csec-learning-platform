import QuestionRepository from "../../adapters/repositories/interfaces/interface.question.respository";
import QuizRepository from "../../adapters/repositories/interfaces/interface.quiz.repository";
import { QuizTypes } from "../../types/quiz.type";
import AbstractQuiz from "../abstracts/abstract.quiz.entity";
import Question from "./interface.question.entity";

export default interface Quiz {
    id: number | null;
    type: QuizTypes;
    tier_level: number;
    range: number;
    topics: {
        id: number | null;
        name: string;
    }[];
    questions: {
        outline: {
            question_id: number;
        }[];
        details?: Record<number, Question>;
    };
}