import QuestionRepository from "../../adapters/repositories/interfaces/interface.question.respository";
import QuizRepository from "../../adapters/repositories/interfaces/interface.quiz.repository";
import { QuizTypes } from "../../types/quiz.type";
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

    generate: <Repository extends QuestionRepository<any>>(amount_of_questions: number, repository: Repository) => Promise<void>;
}