import CreateQuestionDTO from "../../adapters/presenters/dto/question/question.create.dto";
import UpdateQuestionDTO from "../../adapters/presenters/dto/question/question.update.dto";
import QuestionRepository from "../../adapters/repositories/prisma/prisma.question.repository";
import MultipleChoiceQuestion from "../../entities/concretes/multiple.choice.question.entity";
import IQuestion from "../../entities/interfaces/interface.question.entity";
import IUploadRepository from "../../services/file/interface.file.storage.service";
import { QuestionMultipleChoiceType, QuestionSortKeys, QuestionTopicsType, QuestionType } from "../../types/question.type";
import { QueryInput, Sort } from "../../types/repository.type";
import { CreateUseCaseResponse, FindAllUseCaseResponse, SearchUseCaseResponse, UpdateUseCaseResponse } from "../../types/usecase.type";
import { Content } from "../../types/utils.type";

export default class QuestionUseCase {
    private repository: QuestionRepository;
    private fileRepository: IUploadRepository;

    constructor(repository: QuestionRepository, fileRepository: IUploadRepository) {
        this.repository = repository; 
        this.fileRepository = fileRepository;
    }

    async create(data: CreateQuestionDTO): Promise<CreateUseCaseResponse<IQuestion>> {

        const {
            name,
            description,
            tier_level,
            content,
            multiple_choice,
            hints,
            topics
        } = data;

        let question: IQuestion;

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

            const result = await this.repository.save(question);
            return {
                data: result,
                success: true,
                message: 'Question Created Successfully'
            }
        } catch(err) {
            throw err;
        }
        
    };

    async findAll(query: QueryInput<IQuestion>, sort: Sort<QuestionSortKeys>): Promise<FindAllUseCaseResponse<IQuestion>> {
        try {
            const result = await this.repository.findAll(query, sort);
            return {
                amount: result.amount,
                data: result.data || []
            }
        } catch(err) {
            throw err;
        }
    }

    async updateById(id: number, data: UpdateQuestionDTO): Promise<UpdateUseCaseResponse<IQuestion>> {

        const {
            name,
            description,
            tier_level,
            content,
            multiple_choice,
        } = data;

        let question: Partial<QuestionType> = {};

        // Fit Data

        if(name) question.name = name;
        if(description) question.description = description;
        if(tier_level) question.tier_level = tier_level;

        /**
         * @desc below we are mapping the list of data to fit the entity. we are also uploading and getting all media locations here
         */

        question.content = !content ? undefined : await Promise.all(content.map(async (c) => {
            let result: Content = {
                type: "text",
                id: c.id || undefined,
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

        question.multiple_choices = !multiple_choice ? undefined : await Promise.all(multiple_choice.map(async (m) => {
            let result: QuestionMultipleChoiceType = {
                id: m.id || undefined,
                is_correct: m.correct,
                content: {
                    type: 'text',
                    alt: m.alt || undefined,
                    text: m.text || undefined
                }
            }

            if(m.audio) {
                const { location, key } = await this.fileRepository.upload(m.audio);
                result.content.type = 'audio';
                result.content.url = location;
                result.content.key = key
            } 
            else if (m.video) {
                const { location, key } = await this.fileRepository.upload(m.video);
                result.content.type = 'video';
                result.content.url = location;
                result.content.key = key
            }
            else if (m.image) {
                const { location, key } = await this.fileRepository.upload(m.image);
                result.content.type = 'image';
                result.content.url = location;
                result.content.key = key
            } 

            return result;
        }));

        try {
            if(question.tier_level) {
                if(question.tier_level < 0 || question.tier_level > 20) return {
                    success: false,
                    message: 'Difficulty must be between 1 - 20'
                }
            }
            const result = await this.repository.updateById(id, question);
            return {
                data: result,
                success: true,
                message: 'Question Updated Successfully'
            }
        } catch(err) {
            throw err;
        }
        
    };

    async search(search: string, sort: Sort<QuestionSortKeys>): Promise<SearchUseCaseResponse<IQuestion>> {
        try {
            const result = await this.repository.search(search, sort);
            return {
                amount: result.amount,
                data: result.data || []
            }
        } catch(err) {
            throw err;
        }
    }
}