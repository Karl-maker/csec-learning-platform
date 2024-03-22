import Question from "../../../entity/question/question.entity";
import IRepository from "../base/interface.repository";

export default interface IQuestionRepository<T> extends IRepository<Question> {
    data_access: T;
}