import logger from "../../../utils/loggers/logger.util";
import QuestionRepository from "../interfaces/interface.question.repository";
import { PrismaClient, Prisma } from '@prisma/client'
import { Sort, QueryInput, FindResponse, SearchResponse } from "../../../types/repository.type";
import { QuestionModel, QuestionMultipleChoiceType, QuestionPrismaModelType, QuestionTopicsType, QuestionType, TipType } from "../../../types/question.type";
import Question from "../../../entities/interfaces/interface.question.entity";
import { Content, ContentType } from "../../../types/utils.type";
import MultipleChoiceQuestion from "../../../entities/concretes/multiple.choice.question.entity";
import generateRandomOffsets from "../../../utils/generate.random.offset.util";

export default class PrismaQuestionRepository implements QuestionRepository<PrismaClient> {
    database: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.database = prisma
    }

    async find<QuestionSortKeys>(query: QueryInput<Question>, sort: Sort<QuestionSortKeys>): Promise<FindResponse<Question>> {
        logger.debug(`Enter PrismaQuestionRepository.find()`);
    
        const { page, field } = sort;
        const { number, size } = page;
        const { order, key } = field;

        let only = query;
    
        //if(query.only) only = query.only as QuestionFilterBy;

        const [totalCount, results] = await Promise.all([
            await this.database.question.count({
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
            await this.database.question.findMany({
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
                    multiple_choice_answers: true,
                    content: true,
                    topics: {
                        include: {
                            topic: true
                        }
                    },
                    hints: {
                        include: {
                            hint: true
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
        const mappedResults = results.map((result) => this.fitModelToEntity(result));
    
        return {
            data: mappedResults,
            amount: totalCount
        };
    }

    async search<QuestionSortKeys>(search: string, sort: Sort<QuestionSortKeys>): Promise<SearchResponse<Question>> {
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
            await this.database.question.count({
                where: query
            }),
            await this.database.question.findMany({
                where: query,
                include: {
                    multiple_choice_answers: true,
                    content: true,
                    topics: {
                        include: {
                            topic: true
                        }
                    },
                    hints: {
                        include: {
                            hint: true
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
        const mappedResults = results.map((result) => this.fitModelToEntity(result));
    
        return {
            data: mappedResults,
            amount: totalCount
        };
    }
    
    async save(question: Question): Promise<Question> {
        logger.debug(`Enter PrismaQuestionRepository.save()`);

        let result;

        if(question.id) {
            result = await this.database.question.update({
                where: { id: Number(question.id) },
                data: this.fitEntityToModelUpdateQuery(question),
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
        } else {
            result = await this.database.question.create({
                data: this.fitEntityToModelCreateQuery(question),
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
        }

        return this.fitModelToEntity(result as Prisma.QuestionGetPayload<QuestionPrismaModelType>);
    }

    async findForQuizGeneration(tiers: number[], topics: number[], amount: number): Promise<Question[]> {
        logger.debug(`Enter PrismaQuestionRepository.findForQuizGeneration()`);
        tiers = tiers.filter((t) => t > 0)
        try {
            // Get the total number of questions in the database
            const where: Prisma.QuestionWhereInput = {
                tier_level: {
                    in: tiers,
                },
                topics: {
                    some: {
                        topic: {
                            id: {
                                in: topics,
                            },
                        }
                    },
                },
            }
    
            const totalQuestionsCount = await this.database.question.count({
                where
            });

            logger.debug(`PrismaQuestionRepository.findForQuizGeneration().totalQuestionsCount: `, totalQuestionsCount);

            // Generate random offsets for multiple questions
            const randomOffsets = generateRandomOffsets(totalQuestionsCount, amount);

            logger.debug(`PrismaQuestionRepository.findForQuizGeneration().randomOffsets: `, randomOffsets);
    
            // Fetch multiple random questions
            const randomQuestions = await Promise.all(
                randomOffsets.map(async (offset) => await this.database.question.findFirst({
                        where,
                        skip: offset,
                        include: {
                            multiple_choice_answers: true,
                            content: true,
                            topics: {
                                include: {
                                    topic: true
                                }
                            },
                            hints: {
                                include: {
                                    hint: true
                                }
                            }
                        },
                    })
                )
            );

            logger.debug(`PrismaQuestionRepository.findForQuizGeneration().randomOffsets: `, randomQuestions.map((q) => q?.id));
    
            return randomQuestions
                .map((q) => q ? this.fitModelToEntity(q) as Question : null)
                .filter((q): q is Question => q !== null);

        } catch (error) {
            logger.error('Error finding random questions:', error);
            throw new Error('Error finding random questions');
        }
    }

    fitEntityToModelCreateQuery(question: Question): Prisma.QuestionCreateInput {
    
        /**
         * @desc create content for question
         */

        const content = question.content.map((c) => {
            const response: {
                text: null | string;
                type: string;
                url: null | string;
                key: null | string;
                alt: null | string;
            } = {
                text: null,
                type: '',
                url: null,
                key: null,
                alt: null
            };
            response.type = c.type;
            if(c.url) response.url = c.url;
            if(c.text) response.text = c.text;
            if(c.alt) response.alt = c.alt;
            if(c.key) response.key = c.key;

            return response;
        })

        /**
         * @desc create answers for question
         */

        const multiple_choice = question.multiple_choice ? question.multiple_choice.map((m) => {
            const response: {
                text: null | string;
                type: string;
                url: null | string;
                correct: boolean;
            } = {
                text: null,
                type: '',
                url: null,
                correct: false
            };
            response.type = m.content.type;
            response.correct = m.is_correct
            if(m.content.url) response.url = m.content.url;
            if(m.content.text) response.text = m.content.text;
            return response;
        }) : null;

        /**
         * @desc Connect OR Create Tips / Hints
         */

        const hints = question.tips ? question.tips.map((tip) => {
            let response: {
                hint: {
                    connect?: {
                        id: number;
                    };
                    create?: {
                        text: string | null;
                        url: string | null;
                        type: string;
                    };
                };
            };

            response = tip.id ? { 
                hint: { 
                    connect: { id: tip.id as number } 
                } 
            } : {
                hint: { 
                    create: { 
                        text: tip.text || null,
                        url: tip.url || null,
                        type: tip.type
                    } 
                }   
            }

            return response
        }) : [];

        /**
         * @desc Connect OR Create Topics
         */

        const topics = question.topics ? question.topics.map((topic) => {
            let response: {
                topic: {
                    connect?: {
                        id: number;
                    };
                    create?: {
                        name: string;
                        description: string;
                    };
                };
            };

            response = topic.id ? { 
                topic: { 
                    connect: { id: topic.id as number } 
                } 
            } : {
                topic: { 
                    create: { 
                        name: topic.name,
                        description: topic.description,
                    } 
                }   
            }

            return response
        }) : [];

        return {
            name: question.name,
            description: question.description,
            tier_level: question.tier_level,
            content: {
                create: content
            },
            multiple_choice_answers: {
                create: multiple_choice ? multiple_choice : []
            },
            hints: {
                create: hints
            },
            topics: {
                create: topics
            } 
        };
    

    };

    fitEntityToModelUpdateQuery(question: Question): Prisma.QuestionUpdateInput {
    
        /**
         * @desc create content for question
         */

        const content = question.content.map((c) => {
            const response: {
                text: null | string;
                type: string;
                url: null | string;
                key: null | string;
                alt: null | string;
            } = {
                text: null,
                type: '',
                url: null,
                key: null,
                alt: null
            };
            response.type = c.type;
            if(c.url) response.url = c.url;
            if(c.text) response.text = c.text;
            if(c.alt) response.alt = c.alt;
            if(c.key) response.key = c.key;

            return response;
        })

        /**
         * @desc create answers for question
         */

        const multiple_choice = question.multiple_choice ? question.multiple_choice.map((m) => {
            const response: {
                text: null | string;
                type: string;
                url: null | string;
                correct: boolean;
            } = {
                text: null,
                type: '',
                url: null,
                correct: false
            };
            response.type = m.content.type;
            response.correct = m.is_correct
            if(m.content.url) response.url = m.content.url;
            if(m.content.text) response.text = m.content.text;
            return response;
        }) : null;

        /**
         * @desc Connect OR Create Tips / Hints
         */

        const hints = question.tips ? question.tips.map((tip) => {
            let response: {
                hint: {
                    connect?: {
                        id: number;
                    };
                    create?: {
                        text: string | null;
                        url: string | null;
                        type: string;
                    };
                };
            };

            response = tip.id ? { 
                hint: { 
                    connect: { id: tip.id as number } 
                } 
            } : {
                hint: { 
                    create: { 
                        text: tip.text || null,
                        url: tip.url || null,
                        type: tip.type
                    } 
                }   
            }

            return response
        }) : [];

        /**
         * @desc Connect OR Create Topics
         */

        const topics = question.topics ? question.topics.map((topic) => {
            let response: {
                topic: {
                    connect?: {
                        id: number;
                    };
                    create?: {
                        name: string;
                        description: string;
                    };
                };
            };

            response = topic.id ? { 
                topic: { 
                    connect: { id: topic.id as number } 
                } 
            } : {
                topic: { 
                    create: { 
                        name: topic.name,
                        description: topic.description,
                    } 
                }   
            }

            return response
        }) : [];

        return {
            name: question.name,
            description: question.description,
            tier_level: question.tier_level,
            content: {
                create: content
            },
            multiple_choice_answers: {
                create: multiple_choice ? multiple_choice : []
            },
            hints: {
                create: hints
            },
            topics: {
                create: topics
            } 
        };
    

    };

    fitModelToEntity(question: Prisma.QuestionGetPayload<QuestionPrismaModelType>) : Question {

        const content: Content[] = question.content.map((c) => {
            const result: Content = {
                id: c.id,
                type: c.type as ContentType,
            }
    
            if(c.text) result.text = c.text
            if(c.url) result.url = c.url
            if(c.key) result.key = c.key
            if(c.alt) result.key = c.alt
    
            return result
        });
    
        const topics: QuestionTopicsType[] = question.topics ? question.topics.map((t) => {
            return {
                id: t.topic.id,
                name: t.topic.name,
                description: t.topic.description
            }
        }) : [];
    
        const multiple_choices: QuestionMultipleChoiceType[] | undefined = question.multiple_choice_answers ? question.multiple_choice_answers.map((m) => {
            const result: QuestionMultipleChoiceType = {
                is_correct: m.correct,
                content: {
                    type: m.type as ContentType
                }
            }
    
            if(m.id) result.id = m.id;
            if(m.url) result.content.url = m.url;
            if(m.alt) result.content.alt = m.alt;
            if(m.key) result.content.alt = m.key;
            if(m.text) result.content.text = m.text;
    
            return result;
        }) : undefined;
    
        const tips: TipType[] | undefined = question.hints ? question.hints.map((h) => {
            const result: TipType = {
                id: h.hint.id,
                type: h.hint.type as ContentType
            };
    
            if(h.hint.id) result.id = h.hint.id;
            if(h.hint.text) result.text = h.hint.text;
            if(h.hint.alt) result.alt = h.hint.alt;
            if(h.hint.key) result.key = h.hint.key;
            if(h.hint.url) result.url = h.hint.url;
    
            return result;
        }) : undefined;
    
        return new MultipleChoiceQuestion({
            content,
            topics,
            multiple_choices,
            tips,
            tier_level: question.tier_level,
            id: question.id,
            name: question.name,
            description: question.description,
        })
    };
}
