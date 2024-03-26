import logger from "../../../utils/loggers/logger.util";
import { PrismaClient, Prisma } from '@prisma/client'
import { Sort, QueryInput, FindResponse, SearchResponse } from "../../../types/repository.type";
import QuizRepository from "../interfaces/interface.quiz.repository";
import { QuizPrismaModelType } from "../../../types/quiz.type";
import Quiz from "../../../entities/interfaces/interface.quiz.entity";
import BasicQuiz from "../../../entities/concretes/basic.quiz.entity";

export default class PrismaQuizRepository implements QuizRepository<PrismaClient> {
    database: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.database = prisma
    }
      
    async find<QuizSortKeys>(query: QueryInput<Quiz>, sort: Sort<QuizSortKeys>): Promise<FindResponse<Quiz>> {
        logger.debug(`Enter PrismaQuizRepository.find()`);
    
        const { page, field } = sort;
        const { number, size } = page;
        const { order, key } = field;

        let only = query;
    
        //if(query.only) only = query.only as QuestionFilterBy;

        const [totalCount, results] = await Promise.all([
            await this.database.quiz.count({
                where: {
                    topics: only.topics ? {
                        some: {
                            topic: {
                                name: {
                                    in: only.topics
                                }
                            }
                        }
                    } : {}
                } // Add your query conditions here if needed
            }),
            await this.database.quiz.findMany({
                where: {
                    topics: only.topics ? {
                        some: {
                            topic: {
                                name: {
                                    in: only.topics
                                }
                            }
                        }
                    } : {}
                },
                include: {
                    questions: true,
                    topics: {
                        include: {
                            topic: true
                        }
                    },
                },
                orderBy: {
                    [key as string]: order
                },
                skip: (number - 1) * size,
                take: size
            })
        ])
    
        // Assuming fitQuestionPrismaRepositoryToEntity is a function that maps the result to the desired type
        const mappedResults = results.map((result) => this.fitModelToEntity(result));
    
        return {
            data: mappedResults,
            amount: totalCount
        };
    }

    async search<QuizSortKeys>(search: string, sort: Sort<QuizSortKeys>): Promise<SearchResponse<Quiz>> {
        logger.debug(`Enter PrismaQuizRepository.search()`);
    
        const { page, field } = sort;
        const { number, size } = page;
        const { order, key } = field;

        const query = {
            OR: [
                {
                    type: {
                        contains: search
                    }
                },
                {
                    questions: {
                        some: {
                            question: {
                                name: {
                                    contains: search
                                },
                            }
                        }
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
            ]
        };

        const [totalCount, results] = await Promise.all([
            await this.database.quiz.count({
                where: query
            }),
            await this.database.quiz.findMany({
                where: query,
                include: {
                    questions: true,
                    topics: {
                        include: {
                            topic: true
                        }
                    },
                },
                orderBy: {
                    [key as string]: order
                },
                skip: (number - 1) * size,
                take: size
            })
        ]);
        
        // Assuming fitQuestionPrismaRepositoryToEntity is a function that maps the result to the desired type
        const mappedResults = results.map((result) => this.fitModelToEntity(result));
    
        return {
            data: mappedResults,
            amount: totalCount
        };
    }
    
    async save(quiz: Quiz): Promise<Quiz> {
        logger.debug(`Enter PrismaQuizRepository.save()`);
        let result;

        if(quiz.id) {
            result = await this.database.quiz.update({
                where: { id: Number(quiz.id) },
                data: this.fitEntityToModelUpdateQuery(quiz),
                include: {
                    questions: true,
                    topics: {
                        include: {
                            topic: true
                        }
                    },
                }
            }) 
        } else {
            const result = await this.database.quiz.create({
                data: this.fitEntityToModelCreateQuery(quiz),
                include: {
                    questions: true,
                    topics: {
                        include: {
                            topic: true
                        }
                    },
                }
            })
        }
        return this.fitModelToEntity(result as Prisma.QuizGetPayload<QuizPrismaModelType>);
    }

    fitEntityToModelCreateQuery(quiz: Quiz): Prisma.QuizCreateInput {
    
        /**
         * @desc create questions linkage
         */

        const questions = quiz.questions.outline.map((q) => {
            return {
                question: {
                    connect: {
                        id: q.question_id
                    }
                }
            };
        })

        /**
         * @desc create topics linkage
         */


        const topics = quiz.topics.map((t) => {
            return {
                topic: {
                    connect: {
                        id: t.id
                    }
                }
            };
        });

        return {
            tier_level: quiz.tier_level,
            type: quiz.type,
            questions: {
                create: questions
            },
            topics: {
                create: topics 
            }
        };
    

    };

    fitEntityToModelUpdateQuery(quiz: Quiz): Prisma.QuizUpdateInput {
    
        /**
         * @desc create questions linkage
         */

        const questions = quiz.questions.outline.map((q) => {
            return {
                question: {
                    connect: {
                        id: q.question_id
                    }
                }
            };
        })

        /**
         * @desc create topics linkage
         */


        const topics = quiz.topics.map((t) => {
            return {
                topic: {
                    connect: {
                        id: t.id
                    }
                }
            };
        });

        return {
            tier_level: quiz.tier_level,
            type: quiz.type,
            questions: {
                create: questions
            },
            topics: {
                create: topics 
            }
        };
    

    };

    fitModelToEntity(quiz: Prisma.QuizGetPayload<QuizPrismaModelType>) : Quiz {

        const topics = quiz.topics.map((topic) => {
            const t = topic.topic;
            return {
                name: t.name,
                id: t.id
            };
        });

        const question_outline = quiz.questions.map((question) => {
            const id = question.quiz_id;

            return {
                question_id: id
            }
        })
    
        return new BasicQuiz({
            id: quiz.id,
            type: 'generated',
            tier_level: quiz.tier_level,
            topics,
            range: 0,
            question_outline
        })
    };
}
