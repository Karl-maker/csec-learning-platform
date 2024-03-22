import Question from "../../../entity/question/question.entity";
import logger from "../../../utils/loggers/logger.util";
import IRepository from "../base/interface.repository";

export default class QuestionRepository implements IRepository<Question> {
    constructor() {}

    async save(question: Question): Promise<Question> {
        logger.debug(`QuestionRepository.save: `, question);
        return question;
    }
}