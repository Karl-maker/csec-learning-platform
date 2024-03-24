import Quiz from "../../../entities/interfaces/interface.quiz.entity";
import IRepository from "./interface.repository";

export default interface QuizRepository<Model> extends IRepository<Quiz> {
    database: Model;
}