import QuestionRepository from "../../adapters/repositories/interfaces/interface.question.respository";
import { QuizType, QuizTypes } from "../../types/quiz.type";
import arrayToRecord from "../../utils/array.to.record";
import Question from "../interfaces/interface.question.entity";
import Quiz from "../interfaces/interface.quiz.entity";

abstract class AbstractQuiz implements Quiz {
    id: number | null;
    type: QuizTypes;
    tier_level: number;
    range: number;
    topics: { id: number | null; name: string; }[];
    questions: { outline: { question_id: number; }[]; details?: Record<number, Question> | undefined; };

    constructor(data: QuizType){
        this.id = null;
        this.type = data.type;
        this.tier_level = data.tier_level;
        this.topics = data.topics.map((t) => ({ id: null, name: t }));
        this.questions = {
            outline: [],
            details: {}
        }
    }

    async generate <Repository extends QuestionRepository<any>>(amount_of_questions: number, repository: Repository) : Promise<void> {
        
        const questions = await repository.findForQuizGeneration([this.tier_level], this.topics.map((t) => t.name), amount_of_questions);

        this.questions = {
            outline: questions.map((q) => ({ question_id: Number(q.id) })),
            details: arrayToRecord<Question>(questions)
        }
    };
}
export default AbstractQuiz;
