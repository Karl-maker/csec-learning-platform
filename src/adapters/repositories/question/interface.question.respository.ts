import Question from "../../../entity/question/question.entity";
import IRepository from "../base/interface.repository";

export default interface IQuestionRepository extends IRepository<Question> {}