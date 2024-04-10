import { Prisma, PrismaClient } from "@prisma/client";
import { FindResponse, QueryInput, SearchResponse, Sort } from "../../../types/repository.type";
import logger from "../../../utils/loggers/logger.util";
import TopicRepository from "../interfaces/interface.topic.repository";
import Topic from "../../../entities/interfaces/interface.topic.entity";
import { TopicPrismaModelType } from "../../../types/topic.type";
import GeneralTopic from "../../../entities/concretes/general.topic.entity";


export default class PrismaTopicRepository implements TopicRepository<PrismaClient> {
    database: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.database = prisma
    }

    async findByCourse<TopicSortKeys>(course_id: number, sort: Sort<TopicSortKeys>): Promise<FindResponse<Topic>> {
    
        const { page, field } = sort;
        const { number, size } = page;
        const { order, key } = field;

        const [totalCount, results] = await Promise.all([
            await this.database.topic.count({
                where: {
                    courses: {
                        some: {
                            course_id 
                        }
                   }
                } // Add your query conditions here if needed
            }),
            await this.database.topic.findMany({
                where: {
                   courses: {
                        some: {
                            course_id 
                        }
                   }
                },
                include: {
                    courses: true
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

    async find<TopicSortKeys>(query: QueryInput<Topic>, sort: Sort<TopicSortKeys>): Promise<FindResponse<Topic>> {
        logger.debug(`Enter PrismaTopicRepository.find()`);
    
        const { page, field } = sort;
        const { number, size } = page;
        const { order, key } = field;

        let only = query;

        const [totalCount, results] = await Promise.all([
            await this.database.topic.count({
                where: {
                
                } // Add your query conditions here if needed
            }),
            await this.database.topic.findMany({
                where: {
                   
                },
                include: {
                    courses: true
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

    async search<TopicSortKeys>(search: string, sort: Sort<TopicSortKeys>): Promise<SearchResponse<Topic>> {
        logger.debug(`Enter PrismaTopicRepository.search()`);
    
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
                    course: {
                        name: {
                            contains: search
                        }
                    }
                },
                {
                    course: {
                        description: {
                            contains: search
                        }
                    }
                }
            ]
        };

        const [totalCount, results] = await Promise.all([
            await this.database.topic.count({
                where: query
            }),
            await this.database.topic.findMany({
                where: query,
                include: {
                    courses: true
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
    
    async save(topic: Topic): Promise<Topic> {
        logger.debug(`Enter PrismaTopicRepository.save()`);

        let result;

        if(topic.id) {
            const data = this.fitEntityToModelUpdateQuery(topic);
            result = await this.database.topic.update({
                where: { id: Number(topic.id) },
                data,
                include: {
                    courses: true
                }
            }) 
        } else {
            result = await this.database.topic.create({
                data: this.fitEntityToModelCreateQuery(topic),
                include: {
                    courses: true
                }
            })
        }

        return this.fitModelToEntity(result as Prisma.TopicGetPayload<TopicPrismaModelType>);
    }

    fitEntityToModelCreateQuery(topic: Topic): Prisma.TopicCreateInput {

        return {
            name: topic.name,
            description: topic.description,
            courses: {
                create: topic.courses.map((course) => ({
                    course: {
                        connect: {
                            id: course.id
                        }
                    }
                })) 
            }
        };
    };

    fitEntityToModelUpdateQuery(topic: Topic): Prisma.TopicUpdateInput {

        /**
         * @desc create content for account
         */

        let courses: Prisma.CourseTopicUpdateManyWithoutTopicNestedInput = {
            create: [],
            delete: []
        }

        topic.courses.forEach((course) => {
            if(course.id && (course.to_be === 'added' || course.to_be === 'updated') && Array.isArray(courses.create)) courses.create.push({
                course: {
                    connect: {
                        id: course.id
                    }
                }
            } as (Prisma.CourseTopicCreateWithoutTopicInput & Prisma.CourseTopicUncheckedCreateWithoutTopicInput)) 

            if(topic.id && course.id && course.to_be === 'deleted' && Array.isArray(courses.delete)) courses.delete.push({
                course_id_topic_id: {
                    course_id: course.id,
                    topic_id: topic.id
                }
            })
        })

        return {
            name: topic.name,
            description: topic.description,
            courses
        };
    };

    fitModelToEntity(topic: Prisma.TopicGetPayload<TopicPrismaModelType>) : Topic {
    
        return new GeneralTopic({
            id: topic.id,
            name: topic.name,
            description: topic.description,
            courses: topic.courses.map((course) => ({ id: course.course_id }))
        })
    };
}
