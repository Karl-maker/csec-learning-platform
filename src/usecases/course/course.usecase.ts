import CreateCourseDTO from "../../adapters/presenters/dto/course/course.create.dto";
import UpdateCourseDTO from "../../adapters/presenters/dto/course/course.update.dto";
import CourseRepository from "../../adapters/repositories/interfaces/interface.course.repository";
import GeneralCourse from "../../entities/concretes/general.course.entity";
import Course from "../../entities/interfaces/interface.course.entity";
import { CourseSortKeys } from "../../types/course.type";
import { QueryInput, Sort } from "../../types/repository.type";
import { CreateUseCaseResponse, FindAllUseCaseResponse, SearchUseCaseResponse, UpdateUseCaseResponse } from "../../types/usecase.type";

export default class CourseUseCase {
    private courseRepository: CourseRepository<any>;

    constructor(repository: CourseRepository<any>) {
        this.courseRepository = repository; 
    }

    async create(data: CreateCourseDTO): Promise<CreateUseCaseResponse<Course>> {

        const {
            name,
            description,
            subsubject_id
        } = data;

        const course = new GeneralCourse({ name, description, subsubject_id, id: null });

        try {

            const result = await this.courseRepository.save(course);
            return {
                data: result,
                success: true,
                message: 'Course Created Successfully'
            }
        } catch(err) {
            throw err;
        }
        
    };

    async updateById(id: number, data: UpdateCourseDTO): Promise<UpdateUseCaseResponse<Course>> {

        const {
            name,
            description,
            subsubject_id
        } = data;

        let course: Course;

        // Fit Data

        course = new GeneralCourse({ name, description, subsubject_id, id });

        try {
            const result = await this.courseRepository.save(course);
            return {
                data: result,
                success: true,
                message: 'Course Updated Successfully'
            }
        } catch(err) {
            throw err;
        }
        
    };

    async findAll(query: QueryInput<Course>, sort: Sort<CourseSortKeys>): Promise<FindAllUseCaseResponse<Course>> {
        try {
            const result = await this.courseRepository.find(query, sort);
            return {
                amount: result.amount,
                data: result.data || []
            }
        } catch(err) {
            throw err;
        }
    }

    async findBySubSubject(subsubject_id: number, sort: Sort<CourseSortKeys>): Promise<FindAllUseCaseResponse<Course>> {
        try {
            const result = await this.courseRepository.findBySubSubject(subsubject_id, sort);
            return {
                amount: result.amount,
                data: result.data || []
            }
        } catch(err) {
            throw err;
        }
    }

    async search(search: string, sort: Sort<CourseSortKeys>): Promise<SearchUseCaseResponse<Course>> {
        try {
            const result = await this.courseRepository.search(search, sort);
            return {
                amount: result.amount,
                data: result.data || []
            }
        } catch(err) {
            throw err;
        }
    }
}