import Subject from "../../../entities/interfaces/interface.subject.entity";
import IRepository from "./interface.repository";

export default interface SubjectRepository<Model> extends IRepository<Subject> {
    database: Model;
}