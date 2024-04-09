import { SubjectType } from "../../types/subject.type";
import Subject from "../interfaces/interface.subject.entity";

abstract class AbstractSubject implements Subject {
    public id: number | null;
    public name: string;
    public description: string;

    constructor(data: SubjectType) {
        this.id = ('id' in data) ? data.id : null; 
        this.name = data.name;
        this.description = data.description;
    }
}

export default AbstractSubject;
