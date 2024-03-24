import Question from "../../../entities/interfaces/interface.question.entity";
import { QuestionModel } from "../../../types/question.type";
import IRepository from "./interface.repository";

export default interface QuestionRepository<T> extends IRepository<Question> {
    database: T;

    // @override  
    fitModelToEntity(question: QuestionModel) : Question;
    findForQuizGeneration(tiers: number[], topics: string[], amount: number): Promise<Question[]>;
}