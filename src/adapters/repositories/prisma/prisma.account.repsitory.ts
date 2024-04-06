import { Prisma, PrismaClient } from "@prisma/client";
import AccountRepository from "../interfaces/interface.account.repository";
import { FindResponse, QueryInput, SearchResponse, Sort } from "../../../types/repository.type";
import Account from "../../../entities/interfaces/interface.account.entity";
import logger from "../../../utils/loggers/logger.util";
import { AccountPrismaModelType } from "../../../types/account.type";
import GeneralAccount from "../../../entities/concretes/general.account.entity";


export default class PrismaAccountRepository implements AccountRepository<PrismaClient> {
    database: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.database = prisma
    }

    async find<AccountSortKeys>(query: QueryInput<Account>, sort: Sort<AccountSortKeys>): Promise<FindResponse<Account>> {
        logger.debug(`Enter PrismaAccountRepository.find()`);
    
        const { page, field } = sort;
        const { number, size } = page;
        const { order, key } = field;

        let only = query;

        const [totalCount, results] = await Promise.all([
            await this.database.account.count({
                where: {
                
                } // Add your query conditions here if needed
            }),
            await this.database.account.findMany({
                where: {
                   
                },
                include: {
                    student: true,
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

    async search<QuestionSortKeys>(search: string, sort: Sort<QuestionSortKeys>): Promise<SearchResponse<Account>> {
        logger.debug(`Enter PrismaAccountRepository.search()`);
    
        const { page, field } = sort;
        const { number, size } = page;
        const { order, key } = field;

        const query = {
            OR: [
                {
                    first_name: {
                        contains: search
                    }
                },
                {
                    last_name: {
                        contains: search
                    }
                },
                {
                    student: {
                        some: {
                            school: {
                                name: {
                                    contains: search
                                }
                            }
                        }
                    }
                },
                {
                    student: {
                        some: {
                            username: {
                                contains: search
                            }
                        }
                    }
                },
            ]
        };

        const [totalCount, results] = await Promise.all([
            await this.database.account.count({
                where: query
            }),
            await this.database.account.findMany({
                where: query,
                include: {
                    student: true
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
    
    async save(account: Account): Promise<Account> {
        logger.debug(`Enter PrismaAccountRepository.save()`);

        let result;

        if(account.id) {
            const data = this.fitEntityToModelUpdateQuery(account);
            result = await this.database.account.update({
                where: { id: Number(account.id) },
                data,
                include: {
                    student: true
                }
            }) 
        } else {
            result = await this.database.account.create({
                data: this.fitEntityToModelCreateQuery(account),
                include: {
                    student: true
                }
            })
        }

        return this.fitModelToEntity(result as Prisma.AccountGetPayload<AccountPrismaModelType>);
    }

    fitEntityToModelCreateQuery(account: Account): Prisma.AccountCreateInput {

        return {
            email: account.email,
            password: account.password,
            last_name: account.last_name,
            first_name: account.first_name
        };
    

    };

    fitEntityToModelUpdateQuery(account: Account): Prisma.AccountUpdateInput {

        /**
         * @desc create content for account
         */

        // let student: Prisma.StudentUpdateInput = {};

        // if(account.school) {
        //     if(account.school.id && account.school.to_be === 'added' || account.school.to_be === 'updated') {
        //        student.school = {
        //             connect: {
        //                 id: Number(account.school.id)
        //             }
        //        }
        //     } 

        //     if(account.school.id && account.school.to_be === 'deleted') {
        //         student.school = {
        //             disconnect: {
        //                 id: Number(account.school.id)
        //             }
        //         };
        //     } 

        //     if (account.school.name && !account.school.id && account.school.to_be === 'added') {
        //         student.school = {
        //             create: {
        //                 name: account.school.name
        //             }
        //         }
        //     }
        // }

        // if(account.username) student = {
        //     ...student,
        //     username: account.username
        // }

        return {
            first_name: account.first_name,
            last_name: account.last_name
        };
    

    };

    fitModelToEntity(account: Prisma.AccountGetPayload<AccountPrismaModelType>) : Account {
    
        return new GeneralAccount({
            email: account.email,
            password: account.password,
            id: account.id,
            first_name: account.first_name,
            last_name: account.last_name
        })
    };
}
