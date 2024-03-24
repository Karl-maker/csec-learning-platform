import Question from "../../../entities/interfaces/interface.question.entity";
import IRepository from "./interface.repository";

export default interface QuizRepository<T> extends IRepository<Question> {
    database: T;
}