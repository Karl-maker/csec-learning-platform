import { Prisma } from "@prisma/client";
import Question from "../../../entity/question/question.entity";
import logger from "../../../utils/loggers/logger.util";
import IQuestionRepository from "./interface.question.respository";

export default class PrismaQuestionRepository implements IQuestionRepository {
    constructor() {}

    async save(question: Question): Promise<Question> {
        
        logger.debug(`QuestionRepository.save: `, question);
        return question;
    }
}