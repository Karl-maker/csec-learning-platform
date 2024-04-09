import { Prisma, PrismaClient } from "@prisma/client";
import { FindResponse, QueryInput, SearchResponse, Sort } from "../../../types/repository.type";
import Account from "../../../entities/interfaces/interface.account.entity";
import logger from "../../../utils/loggers/logger.util";
import { AccountPrismaModelType } from "../../../types/account.type";
import GeneralAccount from "../../../entities/concretes/general.account.entity";
import SubjectRepository from "../interfaces/interface.subject.repository";
import Subject from "../../../entities/interfaces/interface.subject.entity";
import { SubjectPrismaModelType } from "../../../types/subject.type";
import GeneralSubject from "../../../entities/concretes/general.subject.entity";


export default class PrismaSubjectRepository implements SubjectRepository<PrismaClient> {
    database: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.database = prisma
    }

    async find<SubjectSortKeys>(query: QueryInput<Subject>, sort: Sort<SubjectSortKeys>): Promise<FindResponse<Subject>> {
        logger.debug(`Enter PrismaSubjectRepository.find()`);
    
        const { page, field } = sort;
        const { number, size } = page;
        const { order, key } = field;

        let only = query;

        const [totalCount, results] = await Promise.all([
            await this.database.subject.count({
                where: {
                
                } // Add your query conditions here if needed
            }),
            await this.database.subject.findMany({
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

    async search<SubjectSortKeys>(search: string, sort: Sort<SubjectSortKeys>): Promise<SearchResponse<Subject>> {
        logger.debug(`Enter PrismaAccountRepository.search()`);
    
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
                }
            ]
        };

        const [totalCount, results] = await Promise.all([
            await this.database.subject.count({
                where: query
            }),
            await this.database.subject.findMany({
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
    
    async save(subject: Subject): Promise<Subject> {
        logger.debug(`Enter PrismaAccountRepository.save()`);

        let result;

        if(subject.id) {
            const data = this.fitEntityToModelUpdateQuery(subject);
            result = await this.database.subject.update({
                where: { id: Number(subject.id) },
                data
            }) 
        } else {
            result = await this.database.subject.create({
                data: this.fitEntityToModelCreateQuery(subject)
            })
        }

        return this.fitModelToEntity(result as Prisma.SubjectGetPayload<SubjectPrismaModelType>);
    }

    fitEntityToModelCreateQuery(subject: Subject): Prisma.SubjectCreateInput {

        return {
            name: subject.name,
            description: subject.description
        };
    

    };

    fitEntityToModelUpdateQuery(subject: Subject): Prisma.SubjectUpdateInput {

        /**
         * @desc create content for account
         */

        return {
            name: subject.name,
            description: subject.description
        };
    };

    fitModelToEntity(subject: Prisma.SubjectGetPayload<SubjectPrismaModelType>) : Subject {
    
        return new GeneralSubject({
            id: subject.id,
            name: subject.name,
            description: subject.description
        })
    };
}
