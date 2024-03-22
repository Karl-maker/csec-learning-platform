import Question from "../../../entity/question/question.entity";
import { QuestionSortKeys } from "../../../types/question.type";
import { FindResponse, QueryInput, Sort } from "../../../types/repository.type";
import IRepository from "../base/interface.repository";

export default interface IQuestionRepository<T> extends IRepository<Question> {
    data_access: T;
}