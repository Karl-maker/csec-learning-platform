import { Prisma, PrismaClient } from "@prisma/client";
import { FindResponse, QueryInput, SearchResponse, Sort } from "../../../types/repository.type";
import logger from "../../../utils/loggers/logger.util";
import StudentRepository from "../interfaces/interface.student.repository";
import Student from "../../../entities/interfaces/interface.student.entity";
import { StudentPrismaModelType } from "../../../types/student.type";
import GeneralStudent from "../../../entities/concretes/general.student.entity";


export default class PrismaStudentRepository implements StudentRepository<PrismaClient> {
    database: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.database = prisma
    }

    async find<StudentSortKeys>(query: QueryInput<Student>, sort: Sort<StudentSortKeys>): Promise<FindResponse<Student>> {
        logger.debug(`Enter PrismaStudentRepository.find()`);
    
        const { page, field } = sort;
        const { number, size } = page;
        const { order, key } = field;

        let only = query;

        const [totalCount, results] = await Promise.all([
            await this.database.student.count({
                where: {
                
                } // Add your query conditions here if needed
            }),
            await this.database.student.findMany({
                where: {
                   
                },
                include: {
                    school: true,
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

    async search<QuestionSortKeys>(search: string, sort: Sort<QuestionSortKeys>): Promise<SearchResponse<Student>> {
        logger.debug(`Enter PrismaStudentRepository.search()`);
    
        const { page, field } = sort;
        const { number, size } = page;
        const { order, key } = field;

        const query: Prisma.StudentWhereInput = {
            OR: [
                {
                    school: {
                        name: {
                            contains: search
                        }
                    }
                },
                {
                    username: {
                        contains: search
                    }
                },
                {
                    account: {
                        first_name: {
                            contains: search
                        }
                    }
                },
                {
                    account: {
                        last_name: {
                            contains: search
                        }
                    }
                }, 
            ]
        };

        const [totalCount, results] = await Promise.all([
            await this.database.student.count({
                where: query
            }),
            await this.database.student.findMany({
                where: query,
                include: {
                    school: true
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
    
    async save(student: Student): Promise<Student> {
        logger.debug(`Enter PrismaAccountRepository.save()`);

        let result;

        if(student.id) {
            const data = this.fitEntityToModelUpdateQuery(student);
            result = await this.database.student.update({
                where: { id: Number(student.id) },
                data,
                include: {
                    school: true
                }
            }) 
        } else {
            result = await this.database.student.create({
                data: this.fitEntityToModelCreateQuery(student),
                include: {
                    school: true
                }
            })
        }

        return this.fitModelToEntity(result as Prisma.StudentGetPayload<StudentPrismaModelType>);
    }

    async findByAccountId(account_id: number) : Promise<Student | null> {
        const result = await this.database.student.findFirst({
            where: {
                account_id
            },
            include: {
                school: true,
            },
        });
        if(!result) return null;
        return this.fitModelToEntity(result)
    };

    fitEntityToModelCreateQuery(student: Student): Prisma.StudentCreateInput {
        let linkSchoolQuery = {};

        if(student.school.id) linkSchoolQuery = {
            connect: { id: Number(student.school.id) }
        }

        if(student.school.name && !student.school.id) linkSchoolQuery = {
            create: { name: student.school.name }
        }

        return {
            username: student.username ? student.username : "",
            school: linkSchoolQuery,
            grade: student.grade,
            account: {
                connect: {
                    id: student.account_id
                }
            }
        };
    

    };

    fitEntityToModelUpdateQuery(student: Student): Prisma.StudentUpdateInput {

        /**
         * @desc create content for account
         */

        let update: Prisma.StudentUpdateInput = {};

        if(student.school) {
            if(student.school.id && student.school.to_be === 'added' || student.school.to_be === 'updated') {
               update.school = {
                    connect: {
                        id: Number(student.school.id)
                    }
               }
            } 

            if(student.school.id && student.school.to_be === 'deleted') {
                update.school = {
                    disconnect: {
                        id: Number(student.school.id)
                    }
                };
            } 

            if (student.school.name && !student.school.id && student.school.to_be === 'added') {
                update.school = {
                    create: {
                        name: student.school.name
                    }
                }
            }
        }

        if(student.username) update = {
            ...update,
            username: student.username
        }

        if(student.grade) update = {
            ...update,
            grade: student.grade
        }

        return update;
    

    };

    fitModelToEntity(student: Prisma.StudentGetPayload<StudentPrismaModelType>) : Student {
        return new GeneralStudent({
            username: student.username,
            id: student.id,
            school: {
                name: student.school?.name,
                id: student.school?.id
            },
            account_id: student.account_id,
            grade: student.grade,
            points: student.points
        })
    };
}
