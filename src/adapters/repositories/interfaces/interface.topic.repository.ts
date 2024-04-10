import Topic from "../../../entities/interfaces/interface.topic.entity";
import { FindResponse, Sort } from "../../../types/repository.type";
import IRepository from "./interface.repository";

export default interface TopicRepository<Model> extends IRepository<Topic> {
    database: Model;
    findByCourse: <SortInput>(course_id: number, sort: Sort<SortInput>) => Promise<FindResponse<Topic>>;
}