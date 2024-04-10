import SubSubject from "../../../entities/interfaces/interface.subsubject.entity";
import { FindResponse, Sort } from "../../../types/repository.type";
import IRepository from "./interface.repository";

export default interface SubSubjectRepository<Model> extends IRepository<SubSubject> {
    database: Model;
    findBySubject: <SortInput>(subject_id: number, sort: Sort<SortInput>) => Promise<FindResponse<SubSubject>>;
}