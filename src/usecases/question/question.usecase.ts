import CreateQuestionDTO from "../../adapters/presenters/dto/question/question.create.dto";
import UpdateQuestionDTO from "../../adapters/presenters/dto/question/question.update.dto";
import QuestionRepository from "../../adapters/repositories/interfaces/interface.question.repository";
import MultipleChoiceQuestion from "../../entities/concretes/multiple.choice.question.entity";
import Question from "../../entities/interfaces/interface.question.entity";
import IUploadRepository from "../../services/file/interface.file.storage.service";
import { QuestionMultipleChoiceType, QuestionSortKeys, QuestionTopicsType, QuestionType } from "../../types/question.type";
import { QueryInput, Sort } from "../../types/repository.type";
import { CreateUseCaseResponse, FindAllUseCaseResponse, SearchUseCaseResponse, UpdateUseCaseResponse } from "../../types/usecase.type";
import { Content } from "../../types/utils.type";

export default class QuestionUseCase {
    private questionRepository: QuestionRepository<any>;
    private fileRepository: IUploadRepository;

    constructor(repository: QuestionRepository<any>, fileRepository: IUploadRepository) {
        this.questionRepository = repository; 
        this.fileRepository = fileRepository;
    }

    async create(data: CreateQuestionDTO): Promise<CreateUseCaseResponse<Question>> {

        const {
            name,
            description,
            tier_level,
            content,
            multiple_choice,
            hints,
            topics
        } = data;

        let question: Question;

        // Fit Data

        /**
         * @desc below we are mapping the list of data to fit the entity. we are also uploading and getting all media locations here
         */

        const entity_content: Content[] = await Promise.all(content.map(async (c) => {
            let result: Content = {
                type: "text",
                alt: c.alt || undefined,
                text: c.text || undefined
            }

            if(c.audio) {
                const { location, key } = await this.fileRepository.upload(c.audio);
                result.type = 'audio';
                result.url = location;
                result.key = key
            } 
            else if (c.video) {
                const { location, key } = await this.fileRepository.upload(c.video);
                result.type = 'video';
                result.url = location;
                result.key = key
            }
            else if (c.image) {
                const { location, key } = await this.fileRepository.upload(c.image);
                result.type = 'image';
                result.url = location;
                result.key = key
            } 

            return result;
        }));

        const entity_multiple_choice: QuestionMultipleChoiceType[] | undefined = !multiple_choice ? undefined : await Promise.all(multiple_choice.map(async (choice) => {
            let result: QuestionMultipleChoiceType = {
                is_correct: choice.correct,
                content: {
                    type: "text",
                    text: choice.text || undefined,
                    alt: choice.alt || undefined
                }
            }

            if(choice.audio) {
                const { location, key } = await this.fileRepository.upload(choice.audio);
                result.content.type = 'audio';
                result.content.url = location;
                result.content.key = key
            } 
            else if (choice.video) {
                const { location, key } = await this.fileRepository.upload(choice.video);
                result.content.type = 'video';
                result.content.url = location;
                result.content.key = key
            }
            else if (choice.image) {
                const { location, key } = await this.fileRepository.upload(choice.image);
                result.content.type = 'image';
                result.content.url = location;
                result.content.key = key
            } 

            return result;
        }));

        const entity_hints: Content[] | undefined = !hints ? undefined : await Promise.all(hints.map(async (h) => {
            let result: Content = {
                type: "text",
                alt: h.alt || undefined,
                text: h.text || undefined
            }

            if(h.audio) {
                const { location, key } = await this.fileRepository.upload(h.audio);
                result.type = 'audio';
                result.url = location;
                result.key = key
            } 
            else if (h.video) {
                const { location, key } = await this.fileRepository.upload(h.video);
                result.type = 'video';
                result.url = location;
                result.key = key
            }
            else if (h.image) {
                const { location, key } = await this.fileRepository.upload(h.image);
                result.type = 'image';
                result.url = location;
                result.key = key
            } 

            return result;
        }));

        const entity_topics: QuestionTopicsType[] = topics.map((t) => {
            const result : QuestionTopicsType = {
                id: t.id || undefined,
                name: t.name,
                description: t.description || ""
            }

            return result;
        })

        const entity_data: QuestionType = {
            name,
            description,
            tier_level,
            multiple_choices: entity_multiple_choice,
            content: entity_content,
            topics: entity_topics,
            tips: entity_hints,
            id: null
        }

        question = new MultipleChoiceQuestion(entity_data);

        try {
            if(!question.isDifficultyLevelInRange()) {
                return {
                    success: false,
                    message: 'Tier level must be between 1 and 20'
                };
            };

            const result = await this.questionRepository.save(question);
            return {
                data: result,
                success: true,
                message: 'Question Created Successfully'
            }
        } catch(err) {
            throw err;
        }
        
    };

    async findAll(query: QueryInput<Question>, sort: Sort<QuestionSortKeys>): Promise<FindAllUseCaseResponse<Question>> {
        try {
            const result = await this.questionRepository.find(query, sort);
            return {
                amount: result.amount,
                data: result.data || []
            }
        } catch(err) {
            throw err;
        }
    }

    async search(search: string, sort: Sort<QuestionSortKeys>): Promise<SearchUseCaseResponse<Question>> {
        try {
            const result = await this.questionRepository.search(search, sort);
            return {
                amount: result.amount,
                data: result.data || []
            }
        } catch(err) {
            throw err;
        }
    }
}