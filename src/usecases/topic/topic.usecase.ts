import CreateSubSubjectDTO from "../../adapters/presenters/dto/subsubject/subsubject.create.dto";
import UpdateSubSubjectDTO from "../../adapters/presenters/dto/subsubject/subsubject.update.dto";
import CreateTopicDTO from "../../adapters/presenters/dto/topic/topic.create.dto";
import UpdateTopicDTO from "../../adapters/presenters/dto/topic/topic.update.dto";
import SubSubjectRepository from "../../adapters/repositories/interfaces/interface.subsubject.repository";
import TopicRepository from "../../adapters/repositories/interfaces/interface.topic.repository";
import GeneralSubSubject from "../../entities/concretes/general.subsubject.entity";
import GeneralTopic from "../../entities/concretes/general.topic.entity";
import Course from "../../entities/interfaces/interface.course.entity";
import SubSubject from "../../entities/interfaces/interface.subsubject.entity";
import Topic from "../../entities/interfaces/interface.topic.entity";
import { QueryInput, Sort } from "../../types/repository.type";
import { SubSubjectSortKeys } from "../../types/subsubject.type";
import { TopicSortKeys } from "../../types/topic.type";
import { CreateUseCaseResponse, FindAllUseCaseResponse, SearchUseCaseResponse, UpdateUseCaseResponse } from "../../types/usecase.type";

export default class TopicUseCase {
    private topicRepository: TopicRepository<any>;

    constructor(repository: TopicRepository<any>) {
        this.topicRepository = repository; 
    }

    async create(data: CreateTopicDTO): Promise<CreateUseCaseResponse<Topic>> {

        const {
            name,
            description,
            courses
        } = data;

        const topic = new GeneralTopic({ name, description, courses, id: null });

        try {

            const result = await this.topicRepository.save(topic);
            return {
                data: result,
                success: true,
                message: 'Topic Created Successfully'
            }
        } catch(err) {
            throw err;
        }
        
    };

    async updateById(id: number, data: UpdateTopicDTO): Promise<UpdateUseCaseResponse<Topic>> {

        const {
            name,
            description,
            courses
        } = data;

        let topic: Topic;

        // Fit Data

        topic = new GeneralTopic({ name, description, courses, id });

        try {
            const result = await this.topicRepository.save(topic);
            return {
                data: result,
                success: true,
                message: 'Topic Updated Successfully'
            }
        } catch(err) {
            throw err;
        }
        
    };

    async findAll(query: QueryInput<Topic>, sort: Sort<TopicSortKeys>): Promise<FindAllUseCaseResponse<Topic>> {
        try {
            const result = await this.topicRepository.find(query, sort);
            return {
                amount: result.amount,
                data: result.data || []
            }
        } catch(err) {
            throw err;
        }
    }

    async findByCourse(course_id: number, sort: Sort<TopicSortKeys>): Promise<FindAllUseCaseResponse<Topic>> {
        try {
            const result = await this.topicRepository.findByCourse(course_id, sort);
            return {
                amount: result.amount,
                data: result.data || []
            }
        } catch(err) {
            throw err;
        }
    }

    async search(search: string, sort: Sort<TopicSortKeys>): Promise<SearchUseCaseResponse<Topic>> {
        try {
            const result = await this.topicRepository.search(search, sort);
            return {
                amount: result.amount,
                data: result.data || []
            }
        } catch(err) {
            throw err;
        }
    }
}