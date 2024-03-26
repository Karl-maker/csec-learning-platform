import Quiz from "../../../entities/interfaces/interface.quiz.entity";
import { IReadOnlyRepository } from "./interface.repository";

export default interface QuizRepository<Model> extends IReadOnlyRepository<Quiz> {
    database: Model;
}