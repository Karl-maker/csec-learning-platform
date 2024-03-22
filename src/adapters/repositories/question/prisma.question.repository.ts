import Question from "../../../entity/question/question.entity";
import logger from "../../../utils/loggers/logger.util";
import IQuestionRepository from "./interface.question.respository";
import { PrismaClient } from '@prisma/client'
import { fitQuestionEntityToPrismaCreateInput, fitQuestionPrismaRepositoryToEntity } from "../../../utils/question/data.fit";
import { Sort, FoundData, QueryInput, FindResponse } from "../../../types/repository.type";
import { QuestionSortKeys } from "../../../types/question.type";

export default class PrismaQuestionRepository implements IQuestionRepository<PrismaClient> {
    data_access: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.data_access = prisma
    }

    async findAll<QuestionSortKeys>(query: QueryInput<Question>, sort: Sort<QuestionSortKeys>): Promise<FindResponse<Question>> {
        logger.debug(`Enter PrismaQuestionRepository.find()`);
    
        const { page, field } = sort;
        const { number, size } = page;
        const { order, key } = field;
    
        const totalCount = await this.data_access.question.count({
            where: {} // Add your query conditions here if needed
        });
    
        const results = await this.data_access.question.findMany({
            where: {},
            include: {
                multiple_choice_answers: true,
                content: true,
                topics: {
                    include: {
                        topic: true
                    }
                }
            },
            orderBy: {
                [key as string]: order
            },
            skip: (number - 1) * size,
            take: size
        });
        
        // Assuming fitQuestionPrismaRepositoryToEntity is a function that maps the result to the desired type
        const mappedResults = results.map((result) => fitQuestionPrismaRepositoryToEntity(result));
    
        return {
            data: mappedResults,
            amount: totalCount
        };
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
