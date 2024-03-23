import IQuestion from "../../../entities/interfaces/interface.question.entity";
import { QuestionSortKeys } from "../../../types/question.type";
import { FindResponse, QueryInput, Sort } from "../../../types/repository.type";
import IRepository from "./interface.repository";

export default interface IQuestionRepository<T> extends IRepository<IQuestion> {
    data_access: T;
}