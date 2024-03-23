import IQuestion from "../../../entities/interfaces/interface.question.entity";
import IRepository from "./interface.repository";

export default interface IQuestionRepository<T> extends IRepository<IQuestion> {
    data_access: T;
}