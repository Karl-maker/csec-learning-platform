import QuestionRepository from "../../adapters/repositories/interfaces/interface.question.respository";
import { QuizType, QuizTypes } from "../../types/quiz.type";
import Question from "../interfaces/interface.question.entity";
import Quiz from "../interfaces/interface.quiz.entity";

abstract class AbstractQuiz implements Quiz {
    id: number | null;
    type: QuizTypes;
    tier_level: number;
    range: number;
    topics: { id: number; name?: string; }[];
    questions: { outline: { question_id: number; }[]; details?: Record<number, Question> | undefined; };

    constructor(data: QuizType){
        this.id = data.id || null;
        this.type = data.type;
        this.tier_level = data.tier_level;
        this.range = data.range;
        this.topics = data.topics.map((t) => ({ id: t.id }));
        this.questions = {
            outline: data.question_outline || [],
            details: {}
        }
    }

    addQuestion (question: Question) : void {
        if(!question.id) return;
        this.questions.outline.push({ question_id: question.id as number });
        if(typeof question.id !== 'number') return;
        this.questions.details = {
            ...this.questions.details,
            [question.id] : question
        };
    };
}
export default AbstractQuiz;
