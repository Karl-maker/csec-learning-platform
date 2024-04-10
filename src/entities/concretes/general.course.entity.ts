import { CourseType } from "../../types/course.type";
import AbstractCourse from "../abstracts/abstract.course.entity";
import Course from "../interfaces/interface.course.entity";
/**
 * @desc Entity type for Account
 */

export default class GeneralCourse extends AbstractCourse implements Course {
    constructor(data: CourseType) {
        super(data)
    }
}
