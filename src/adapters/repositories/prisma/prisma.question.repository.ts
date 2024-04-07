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
            const data = this.fitEntityToModelUpdateQuery(question);
            result = await this.database.question.update({
                where: { id: Number(question.id) },
                data,
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
                    },
                    hints: {
                        include: {
                            hint: true
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

            // Generate random offsets for multiple questions
            const randomOffsets = generateRandomOffsets(totalQuestionsCount, amount);
    
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

        let update: Prisma.QuestionUpdateInput = {};

        question.content.forEach((c) => {
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

            if(!update.content) update.content = {};

            if(!c.id && c.to_be === 'added') {
                if(!Array.isArray(update.content.create)) update.content.create = [];
                update.content?.create.push({
                    ...response
                })
            }
            if(c.id && c.to_be === 'updated') {
                if(!Array.isArray(update.content.update)) update.content.update = [];
                update.content?.update.push({
                    where: {
                        id: c.id
                    },
                    data: {
                        ...response
                    }
                })
            }
            if(c.id && c.to_be === 'deleted') {
                if(!Array.isArray(update.content.delete)) update.content.delete = [];
                update.content?.delete.push({
                    id: c.id
                })
            }
        })

        /**
         * @desc create answers for question
         */

        if(question.multiple_choice) question.multiple_choice.forEach((m) => {
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

            if(!update.multiple_choice_answers) update.multiple_choice_answers = {};

            if(!m.id && m.to_be === 'added') {
                if(!Array.isArray(update.multiple_choice_answers.create)) update.multiple_choice_answers.create = []
                update.multiple_choice_answers.create.push({
                    ...response
                })
            }

            if(m.id && m.to_be === 'updated'){ 
                console.log('NIGGAS BE WILDIN', response)
                if(!Array.isArray(update.multiple_choice_answers.update)) update.multiple_choice_answers.update = []
                update.multiple_choice_answers.update.push({
                    where: {
                        id: m.id
                    },
                    data: {
                        ...response
                    }
                })
            }
            if(m.id && m.to_be === 'deleted') {
                if(!Array.isArray(update.multiple_choice_answers.delete)) update.multiple_choice_answers.delete = []
                update.multiple_choice_answers.delete.push({
                    id: m.id
                }) 
            }
        });
        /**
         * @desc Connect OR Create Tips / Hints
         */

        if(question.tips) question.tips.map((tip) => {

            if(!update.hints) update.hints = {};

            if(tip.id && tip.to_be === 'added') {
                if(!Array.isArray(update.hints?.create)) update.hints.create = [];
                update.hints.create.push({
                    hint: {
                        connect: {
                            id: tip.id
                        }
                    },
                } as (Prisma.QuestionHintCreateWithoutQuestionInput & Prisma.QuestionHintUncheckedCreateWithoutQuestionInput));
            }

            if(!tip.id && tip.to_be === 'added') {
                if(!Array.isArray(update.hints?.create)) update.hints.create = [];
                update.hints.create.push({
                    hint: {
                        create: {
                            url: tip.url,
                            text: tip.text,
                            alt: tip.alt,
                            type: tip.type,
                            key: tip.key,
                        }
                    },
                } as (Prisma.QuestionHintCreateWithoutQuestionInput & Prisma.QuestionHintUncheckedCreateWithoutQuestionInput));
            }

            if(tip.id && tip.to_be === 'updated') { 
                if(!Array.isArray(update.hints?.update)) update.hints.update = [];
                update.hints?.update.push({
                    where: {
                        hint_id_question_id: {
                            hint_id: tip.id,
                            question_id: Number(question.id)
                        }
                    },
                    data: {
                        hint: {
                            upsert: {
                                update: {
                                    text: tip.text || null,
                                    url: tip.url || null,
                                    type: String(tip.type) 
                                },
                                create: {
                                    text: tip.text || null,
                                    url: tip.url || null,
                                    type: String(tip.type) 
                                }
                            }
                        },
                    }
                })
            }
            if(tip.id && tip.to_be === 'deleted'){ 
                if(!Array.isArray(update.hints?.delete)) update.hints.delete = [];
                update.hints?.delete.push({
                    hint_id_question_id: {
                        hint_id: tip.id,
                        question_id: Number(question.id)
                    }
                })
            }
        });

        /**
         * @desc Connect OR Create Topics
         */

        if(question.topics) question.topics.map((topic) => {
            if(!update.topics) update.topics = {};

            if(topic.id && topic.to_be === 'added') {
                if(!Array.isArray(update.topics?.create)) update.topics.create = [];
                update.topics.create.push({
                    topic: {
                        connect: {
                            id: topic.id
                        }
                    },
                } as (Prisma.QuestionTopicCreateWithoutQuestionInput & Prisma.QuestionTopicUncheckedCreateWithoutQuestionInput));
            }

            if(!topic.id && topic.to_be === 'added') {
                if(!Array.isArray(update.topics?.create)) update.topics.create = [];
                update.topics.create.push({
                    topic: {
                        create: {
                            name: topic.name,
                            description: topic.description
                        }
                    },
                } as (Prisma.QuestionTopicCreateWithoutQuestionInput & Prisma.QuestionTopicUncheckedCreateWithoutQuestionInput));
            }

            if(topic.id && topic.to_be === 'updated') {
                if(!Array.isArray(update.topics?.update)) update.topics.update = []
                update.topics?.update.push({
                    where: {
                        question_id_topic_id: {
                            topic_id: topic.id,
                            question_id: Number(question.id)
                        }
                    },
                    data: {
                        topic: {
                            upsert: {
                                update: {
                                    name: topic.name,
                                    description: topic.description
                                },
                                create: {
                                    name: topic.name,
                                    description: topic.description
                                }
                            }
                        },
                    }
                })
            }

            if(topic.id && topic.to_be === 'deleted') {
                if(!Array.isArray(update.topics?.delete)) update.topics.delete = []
                update.topics?.delete.push({
                    question_id_topic_id: {
                        topic_id: topic.id,
                        question_id: Number(question.id)
                    }
                })
            }
        });

        return {
            name: question.name,
            description: question.description,
            tier_level: question.tier_level,
            ...update
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

        if(multiple_choices) {
            return new MultipleChoiceQuestion({
                content,
                topics,
                multiple_choices,
                tips,
                tier_level: question.tier_level,
                id: question.id,
                name: question.name,
                description: question.description,
            });
        }
    
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
