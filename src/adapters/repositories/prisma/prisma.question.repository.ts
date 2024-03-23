import logger from "../../../utils/loggers/logger.util";
import IQuestionRepository from "../interfaces/interface.question.respository";
import { PrismaClient, Prisma } from '@prisma/client'
import { fitQuestionEntityToPrismaCreateInput, fitQuestionPrismaRepositoryToEntity } from "../../../utils/question/data.fit";
import { Sort, FoundData, QueryInput, FindResponse, SearchResponse } from "../../../types/repository.type";
import { QuestionType } from "../../../types/question.type";
import IQuestion from "../../../entities/interfaces/interface.question.entity";
import { Content } from "../../../types/utils.type";

export default class PrismaQuestionRepository implements IQuestionRepository<PrismaClient> {
    data_access: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.data_access = prisma
    }

    async updateById(id: number, data: Partial<QuestionType>): Promise<IQuestion> {

        let update: Prisma.XOR<Prisma.QuestionUpdateInput, Prisma.QuestionUncheckedUpdateInput> = {};

        /**
         * @desc Adding basic type updates
         */

        if(data.name) update.name = data.name;
        if(data.description) update.description = data.description;
        if(data.tier_level) update.tier_level = data.tier_level;

        /**
         * @desc complex updates
         */

        if(data.content) {
            update.content = {
                update: [],
                create: []
            }
            
            data.content.forEach((c) => {
                const data : Content = {
                    type: c.type,
                    alt: c.alt,
                    text: c.text,
                    key: c.key,
                    url: c.url
                };

                if(c.id && Array.isArray(update.content?.update)) update.content?.update.push({
                    where: {
                        id: c.id
                    },
                    data
                })

                if(!c.id && Array.isArray(update.content?.create)) update.content?.create.push({
                    ...data
                })
            });
        }

        if(data.multiple_choices) {
            update.multiple_choice_answers = {
                update: [],
                create: []
            }
            
            data.multiple_choices.forEach((m) => {
                const data = {
                    type: m.content.type,
                    alt: m.content.alt,
                    text: m.content.text,
                    key: m.content.key,
                    url: m.content.url,
                    correct: m.is_correct
                };

                if(m.id && Array.isArray(update.multiple_choice_answers?.update)) update.multiple_choice_answers?.update.push({
                    where: {
                        id: m.id
                    },
                    data
                })

                if(!m.id && Array.isArray(update.multiple_choice_answers?.create)) update.multiple_choice_answers?.create.push({
                    ...data
                })
            });
        }

        const result = await this.data_access.question.update({
            where: {
                id
            },
            data: update,
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

        return fitQuestionPrismaRepositoryToEntity(result)
    };

    async findAll<QuestionSortKeys>(query: QueryInput<IQuestion>, sort: Sort<QuestionSortKeys>): Promise<FindResponse<IQuestion>> {
        logger.debug(`Enter PrismaQuestionRepository.find()`);
    
        const { page, field } = sort;
        const { number, size } = page;
        const { order, key } = field;

        const [totalCount, results] = await Promise.all([
            await this.data_access.question.count({
                where: {} // Add your query conditions here if needed
            }),
            await this.data_access.question.findMany({
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
            })
        ])
    
        // Assuming fitQuestionPrismaRepositoryToEntity is a function that maps the result to the desired type
        const mappedResults = results.map((result) => fitQuestionPrismaRepositoryToEntity(result));
    
        return {
            data: mappedResults,
            amount: totalCount
        };
    }

    async search<QuestionSortKeys>(search: string, sort: Sort<QuestionSortKeys>): Promise<SearchResponse<IQuestion>> {
        logger.debug(`Enter PrismaQuestionRepository.search()`);
    
        const { page, field } = sort;
        const { number, size } = page;
        const { order, key } = field;

        const query = {
            OR: [
                {
                    name: {
                        contains: search
                    }
                },
                {
                    description: {
                        contains: search
                    }
                },
                {
                    topics: {
                        some: {
                            topic: {
                                name: {
                                    contains: search
                                }
                            }
                        }
                    }
                },
                {
                    content: {
                        some: {
                            text: {
                                contains: search
                            }
                        }
                    }
                },
                {
                    hints: {
                        some: {
                            hint: {
                                text: {
                                    contains: search
                                }
                            }
                        }
                    }
                },
                {
                    multiple_choice_answers: {
                        some: {
                            text: {
                                contains: search
                            }
                        }
                    }
                }
            ]
        };

        const [totalCount, results] = await Promise.all([
            await this.data_access.question.count({
                where: query
            }),
            await this.data_access.question.findMany({
                where: query,
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
            })
        ]);
        
        // Assuming fitQuestionPrismaRepositoryToEntity is a function that maps the result to the desired type
        const mappedResults = results.map((result) => fitQuestionPrismaRepositoryToEntity(result));
    
        return {
            data: mappedResults,
            amount: totalCount
        };
    }
    
    async save(question: IQuestion): Promise<IQuestion> {
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
