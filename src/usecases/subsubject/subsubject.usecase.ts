import CreateSubSubjectDTO from "../../adapters/presenters/dto/subsubject/subsubject.create.dto";
import UpdateSubSubjectDTO from "../../adapters/presenters/dto/subsubject/subsubject.update.dto";
import SubSubjectRepository from "../../adapters/repositories/interfaces/interface.subsubject.repository";
import GeneralSubSubject from "../../entities/concretes/general.subsubject.entity";
import Course from "../../entities/interfaces/interface.course.entity";
import SubSubject from "../../entities/interfaces/interface.subsubject.entity";
import { QueryInput, Sort } from "../../types/repository.type";
import { SubSubjectSortKeys } from "../../types/subsubject.type";
import { CreateUseCaseResponse, FindAllUseCaseResponse, SearchUseCaseResponse, UpdateUseCaseResponse } from "../../types/usecase.type";

export default class SubSubjectUseCase {
    private subSubjectRepository: SubSubjectRepository<any>;

    constructor(repository: SubSubjectRepository<any>) {
        this.subSubjectRepository = repository; 
    }

    async create(data: CreateSubSubjectDTO): Promise<CreateUseCaseResponse<SubSubject>> {

        const {
            name,
            description,
            subject_id
        } = data;

        const subsubject = new GeneralSubSubject({ name, description, subject_id, id: null });

        try {

            const result = await this.subSubjectRepository.save(subsubject);
            return {
                data: result,
                success: true,
                message: 'Subject Breakdown Created Successfully'
            }
        } catch(err) {
            throw err;
        }
        
    };

    async updateById(id: number, data: UpdateSubSubjectDTO): Promise<UpdateUseCaseResponse<SubSubject>> {

        const {
            name,
            description,
            subject_id
        } = data;

        let subsubject: SubSubject;

        // Fit Data

        subsubject = new GeneralSubSubject({ name, description, subject_id, id });

        try {
            const result = await this.subSubjectRepository.save(subsubject);
            return {
                data: result,
                success: true,
                message: 'Subject Breakdown Updated Successfully'
            }
        } catch(err) {
            throw err;
        }
        
    };

    async findAll(query: QueryInput<Course>, sort: Sort<SubSubjectSortKeys>): Promise<FindAllUseCaseResponse<SubSubject>> {
        try {
            const result = await this.subSubjectRepository.find(query, sort);
            return {
                amount: result.amount,
                data: result.data || []
            }
        } catch(err) {
            throw err;
        }
    }

    async findBySubject(subject_id: number, sort: Sort<SubSubjectSortKeys>): Promise<FindAllUseCaseResponse<SubSubject>> {
        try {
            const result = await this.subSubjectRepository.findBySubject(subject_id, sort);
            return {
                amount: result.amount,
                data: result.data || []
            }
        } catch(err) {
            throw err;
        }
    }

    async search(search: string, sort: Sort<SubSubjectSortKeys>): Promise<SearchUseCaseResponse<SubSubject>> {
        try {
            const result = await this.subSubjectRepository.search(search, sort);
            return {
                amount: result.amount,
                data: result.data || []
            }
        } catch(err) {
            throw err;
        }
    }
}