import { SubjectType } from "../../types/subject.type";
import AbstractSubject from "../abstracts/abstract.subject.entity";
import Subject from "../interfaces/interface.subject.entity";
/**
 * @desc Entity type for Account
 */

export default class GeneralSubject extends AbstractSubject implements Subject {
    constructor(data: SubjectType) {
        super(data)
    }
}
