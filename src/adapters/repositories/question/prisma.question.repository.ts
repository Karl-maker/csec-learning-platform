import Question from "../../../entity/question/question.entity";
import logger from "../../../utils/loggers/logger.util";
import IQuestionRepository from "./interface.question.respository";
import { PrismaClient } from '@prisma/client'
import { fitQuestionEntityToPrismaCreateInput, fitQuestionPrismaRepositoryToEntity } from "../../../utils/question/data.fit";

export default class PrismaQuestionRepository implements IQuestionRepository<PrismaClient> {
    data_access: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.data_access = prisma
    }

    async save(question: Question): Promise<Question> {
        logger.debug(`Enter PrismaQuestionRepository.save()`);

        const result = await this.data_access.question.create({
            data: fitQuestionEntityToPrismaCreateInput(question),
            include: {
                multiple_choice_answers: true,
                content: true,
                topics: {
                    include: {
                        topic: true
                    }
                }
            }
        })
        return fitQuestionPrismaRepositoryToEntity(result);
    }
}
