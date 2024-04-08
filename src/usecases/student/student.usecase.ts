import CreateStudentDTO from "../../adapters/presenters/dto/student/student.create.dto";
import StudentRepository from "../../adapters/repositories/interfaces/interface.student.repository";
import GeneralStudent from "../../entities/concretes/general.student.entity";
import Student from "../../entities/interfaces/interface.student.entity";
import { CreateUseCaseResponse } from "../../types/usecase.type";

export default class StudentUseCase {
    private studentRepository: StudentRepository<any>;

    constructor(studentRepository: StudentRepository<any>) {
        this.studentRepository = studentRepository; 
    }
    
    async findByAccount(account_id: number): Promise<Student | null> {
        return this.studentRepository.findByAccountId(account_id);
    }

    async create(account_id: number, data: CreateStudentDTO): Promise<CreateUseCaseResponse<Student>> {
        
        if(await this.studentRepository.findByAccountId(account_id)) return {
            data: undefined,
            success: false,
            message: 'Student Account Already Created'
        }

        const student = new GeneralStudent({
            username: data.username,
            school: {
                name: data.school.name,
                id: data.school.id
            },
            account_id,
            grade: data.grade,
            id: null
        })
        const result = await this.studentRepository.save(student);

        return {
            data: result,
            success: true,
            message: 'Created Student Profile'
        }
    }
}