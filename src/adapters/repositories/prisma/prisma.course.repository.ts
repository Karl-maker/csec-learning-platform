import { Prisma, PrismaClient } from "@prisma/client";
import { FindResponse, QueryInput, SearchResponse, Sort } from "../../../types/repository.type";
import logger from "../../../utils/loggers/logger.util";
import CourseRepository from "../interfaces/interface.course.repository";
import Course from "../../../entities/interfaces/interface.course.entity";
import { CoursePrismaModelType } from "../../../types/course.type";
import GeneralCourse from "../../../entities/concretes/general.course.entity";


export default class PrismaCourseRepository implements CourseRepository<PrismaClient> {
    database: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.database = prisma
    }

    async findBySubSubject<CourseSortKey>(subject_breakdown_id: number, sort: Sort<CourseSortKey>): Promise<FindResponse<Course>> {
    
        const { page, field } = sort;
        const { number, size } = page;
        const { order, key } = field;

        const [totalCount, results] = await Promise.all([
            await this.database.course.count({
                where: {
                    subject_breakdown_id
                } // Add your query conditions here if needed
            }),
            await this.database.course.findMany({
                where: {
                    subject_breakdown_id
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

    async find<CourseSortKeys>(query: QueryInput<Course>, sort: Sort<CourseSortKeys>): Promise<FindResponse<Course>> {
        logger.debug(`Enter PrismaTopicRepository.find()`);
    
        const { page, field } = sort;
        const { number, size } = page;
        const { order, key } = field;

        let only = query;

        const [totalCount, results] = await Promise.all([
            await this.database.course.count({
                where: {
                
                } // Add your query conditions here if needed
            }),
            await this.database.course.findMany({
                where: {
                   
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

    async search<CourseSortKeys>(search: string, sort: Sort<CourseSortKeys>): Promise<SearchResponse<Course>> {
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
                    subject_breakdown: {
                        name: {
                            contains: search
                        }
                    }
                },
                {
                    subject_breakdown: {
                        description: {
                            contains: search
                        }
                    }
                }
            ]
        };

        const [totalCount, results] = await Promise.all([
            await this.database.course.count({
                where: query
            }),
            await this.database.course.findMany({
                where: query,
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
    
    async save(course: Course): Promise<Course> {
        logger.debug(`Enter PrismaTopicRepository.save()`);

        let result;

        if(course.id) {
            const data = this.fitEntityToModelUpdateQuery(course);
            result = await this.database.course.update({
                where: { id: Number(course.id) },
                data
            }) 
        } else {
            result = await this.database.course.create({
                data: this.fitEntityToModelCreateQuery(course)
            })
        }

        return this.fitModelToEntity(result as Prisma.CourseGetPayload<CoursePrismaModelType>);
    }

    fitEntityToModelCreateQuery(course: Course): Prisma.CourseCreateInput {

        return {
            name: course.name,
            description: course.description,
            subject_breakdown: {
                connect: {
                    id: course.subsubject_id
                }
            }
        };
    };

    fitEntityToModelUpdateQuery(course: Course): Prisma.CourseUpdateInput {


        return {
            name: course.name,
            description: course.description,
            subject_breakdown: {
                connect: {
                    id: course.subsubject_id
                }
            }
        };
    };

    fitModelToEntity(course: Prisma.CourseGetPayload<CoursePrismaModelType>) : Course {
    
        return new GeneralCourse({
            id: course.id,
            name: course.name,
            description: course.description,
            subsubject_id: course.subject_breakdown_id
        })
    };
}
