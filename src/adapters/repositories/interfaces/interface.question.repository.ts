import Question from "../../../entities/interfaces/interface.question.entity";
import IRepository from "./interface.repository";

export default interface QuestionRepository<Model> extends IRepository<Question> {
    database: Model;

    // @override  
    findForQuizGeneration(tiers: number[], topics: number[], amount: number): Promise<Question[]>;
}