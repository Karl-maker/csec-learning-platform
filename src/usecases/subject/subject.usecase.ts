import CreateSubjectDTO from "../../adapters/presenters/dto/subject/subject.create.dto";
import UpdateSubjectDTO from "../../adapters/presenters/dto/subject/subject.update.dto";
import SubjectRepository from "../../adapters/repositories/interfaces/interface.subject.repository";
import GeneralSubject from "../../entities/concretes/general.subject.entity";
import Subject from "../../entities/interfaces/interface.subject.entity";
import { QueryInput, Sort } from "../../types/repository.type";
import { SubjectSortKeys } from "../../types/subject.type";
import { CreateUseCaseResponse, FindAllUseCaseResponse, UpdateUseCaseResponse } from "../../types/usecase.type";

export default class SubjectUseCase {
    private subjectRepository: SubjectRepository<any>;

    constructor(subjectRepository: SubjectRepository<any>) {
        this.subjectRepository = subjectRepository; 
    }

    async create(data: CreateSubjectDTO): Promise<CreateUseCaseResponse<Subject>> {

        const subject = new GeneralSubject({
            name: data.name,
            description: data.description,
            id: null
        })
        const result = await this.subjectRepository.save(subject);

        return {
            data: result,
            success: true,
            message: 'Created Subject'
        }
    }

    async findAll(query: QueryInput<Subject>, sort: Sort<SubjectSortKeys>): Promise<FindAllUseCaseResponse<Subject>> {
        try {
            const result = await this.subjectRepository.find(query, sort);
            return {
                amount: result.amount,
                data: result.data || []
            }
        } catch(err) {
            throw err;
        }
    }

    async updateById(id: number, data: UpdateSubjectDTO): Promise<UpdateUseCaseResponse<Subject>> {

        const {
            name,
            description,
        } = data;

        let subject: Subject;

        // Fit Data

        subject = new GeneralSubject({ name, description, id });

        try {

            const result = await this.subjectRepository.save(subject);
            return {
                data: result,
                success: true,
                message: 'Subject Updated Successfully'
            }
        } catch(err) {
            throw err;
        }
        
    };

}