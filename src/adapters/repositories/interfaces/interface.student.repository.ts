import Student from "../../../entities/interfaces/interface.student.entity";
import IRepository from "./interface.repository";

export default interface StudentRepository<Model> extends IRepository<Student> {
    database: Model;
}