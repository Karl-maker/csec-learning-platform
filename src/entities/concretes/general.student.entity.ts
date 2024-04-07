import { StudentType } from "../../types/student.type";
import AbstractStudent from "../abstracts/abstract.student.entity";
import Student from "../interfaces/interface.student.entity";
/**
 * @desc Entity type for Account
 */

export default class GeneralStudent extends AbstractStudent implements Student {
    constructor(data: StudentType) {
        super(data)
    }
}
