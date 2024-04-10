import Course from "../../../entities/interfaces/interface.course.entity";
import { FindResponse, Sort } from "../../../types/repository.type";
import IRepository from "./interface.repository";

export default interface CourseRepository<Model> extends IRepository<Course> {
    database: Model;
    findBySubSubject: <SortInput>(subsubject_id: number, sort: Sort<SortInput>) => Promise<FindResponse<Course>>;
}