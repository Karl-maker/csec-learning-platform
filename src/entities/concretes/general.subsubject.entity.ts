import { SubSubjectType } from "../../types/subsubject.type";
import AbstractSubSubject from "../abstracts/abstract.subsubject.entity";
import SubSubject from "../interfaces/interface.subsubject.entity";
/**
 * @desc Entity type for Account
 */

export default class GeneralSubSubject extends AbstractSubSubject implements SubSubject {
    constructor(data: SubSubjectType) {
        super(data)
    }
}
