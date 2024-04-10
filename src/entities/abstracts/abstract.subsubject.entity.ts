import { SubSubjectType } from "../../types/subsubject.type";
import SubSubject from "../interfaces/interface.subsubject.entity";

abstract class AbstractSubSubject implements SubSubject {
    public id: number | null;
    public name: string;
    public description: string;
    public subject_id: number;

    constructor(data: SubSubjectType) {
        this.id = ('id' in data) ? data.id : null; 
        this.name = data.name;
        this.description = data.description;
        this.subject_id = data.subject_id;
    }
}

export default AbstractSubSubject;
