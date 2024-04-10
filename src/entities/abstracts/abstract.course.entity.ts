import { CourseType } from "../../types/course.type";
import Course from "../interfaces/interface.course.entity";

abstract class AbstractCourse implements Course {
    public id: number | null;
    public name: string;
    public description: string;
    public subsubject_id: number;

    constructor(data: CourseType) {
        this.id = ('id' in data) ? data.id : null; 
        this.name = data.name;
        this.description = data.description;
        this.subsubject_id = data.subsubject_id;
    }
}

export default AbstractCourse;
