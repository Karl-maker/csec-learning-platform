import { Prisma, PrismaClient } from "@prisma/client";
import { FindResponse, QueryInput, SearchResponse, Sort } from "../../../types/repository.type";
import logger from "../../../utils/loggers/logger.util";
import TopicRepository from "../interfaces/interface.topic.repository";
import Topic from "../../../entities/interfaces/interface.topic.entity";
import { TopicPrismaModelType } from "../../../types/topic.type";
import GeneralTopic from "../../../entities/concretes/general.topic.entity";
import SubSubjectRepository from "../interfaces/interface.subsubject.repository";
import SubSubject from "../../../entities/interfaces/interface.subsubject.entity";
import { SubSubjectPrismaModelType } from "../../../types/subsubject.type";
import GeneralSubSubject from "../../../entities/concretes/general.subsubject.entity";


export default class PrismaSubSubjectRepository implements SubSubjectRepository<PrismaClient> {
    database: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.database = prisma
    }

    async findBySubject<SubjectSortKey>(subject_id: number, sort: Sort<SubjectSortKey>): Promise<FindResponse<SubSubject>> {
    
        const { page, field } = sort;
        const { number, size } = page;
        const { order, key } = field;

        const [totalCount, results] = await Promise.all([
            await this.database.subjectBreakdown.count({
                where: {
                    subject_id
                } // Add your query conditions here if needed
            }),
            await this.database.subjectBreakdown.findMany({
                where: {
                    subject_id
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

    async find<SubSubjectSortKeys>(query: QueryInput<SubSubject>, sort: Sort<SubSubjectSortKeys>): Promise<FindResponse<SubSubject>> {
        logger.debug(`Enter PrismaTopicRepository.find()`);
    
        const { page, field } = sort;
        const { number, size } = page;
        const { order, key } = field;

        let only = query;

        const [totalCount, results] = await Promise.all([
            await this.database.subjectBreakdown.count({
                where: {
                
                } // Add your query conditions here if needed
            }),
            await this.database.subjectBreakdown.findMany({
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

    async search<SubSubjectSortKeys>(search: string, sort: Sort<SubSubjectSortKeys>): Promise<SearchResponse<SubSubject>> {
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
                    subject: {
                        name: {
                            contains: search
                        }
                    }
                },
                {
                    subject: {
                        description: {
                            contains: search
                        }
                    }
                }
            ]
        };

        const [totalCount, results] = await Promise.all([
            await this.database.subjectBreakdown.count({
                where: query
            }),
            await this.database.subjectBreakdown.findMany({
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
    
    async save(subsubject: SubSubject): Promise<SubSubject> {
        logger.debug(`Enter PrismaSubSubjectRepository.save()`, subsubject);

        let result;

        if(subsubject.id) {
            const data = this.fitEntityToModelUpdateQuery(subsubject);
            result = await this.database.subjectBreakdown.update({
                where: { id: Number(subsubject.id) },
                data
            }) 
        } else {
            result = await this.database.subjectBreakdown.create({
                data: this.fitEntityToModelCreateQuery(subsubject)
            })
        }

        return this.fitModelToEntity(result as Prisma.SubjectBreakdownGetPayload<SubSubjectPrismaModelType>);
    }

    fitEntityToModelCreateQuery(subjectBreakdown: SubSubject): Prisma.SubjectBreakdownCreateInput {

        return {
            name: subjectBreakdown.name,
            description: subjectBreakdown.description,
            subject: {
                connect: {
                    id: subjectBreakdown.subject_id
                }
            }
        };
    };

    fitEntityToModelUpdateQuery(subjectBreakdown: SubSubject): Prisma.SubjectBreakdownUpdateInput {


        return {
            name: subjectBreakdown.name,
            description: subjectBreakdown.description,
            subject: {
                connect: {
                    id: subjectBreakdown.subject_id
                }
            }
        };
    };

    fitModelToEntity(subjectBreakdown: Prisma.SubjectBreakdownGetPayload<SubSubjectPrismaModelType>) : SubSubject {
    
        return new GeneralSubSubject({
            id: subjectBreakdown.id,
            name: subjectBreakdown.name,
            description: subjectBreakdown.description,
            subject_id: subjectBreakdown.subject_id
        })
    };
}
