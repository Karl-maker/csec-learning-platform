import CreateQuestionDTO from "../../adapters/presenters/dto/question/question.create.dto";
import UpdateQuestionDTO from "../../adapters/presenters/dto/question/question.update.dto";
import QuestionRepository from "../../adapters/repositories/interfaces/interface.question.repository";
import MultipleChoiceQuestion from "../../entities/concretes/multiple.choice.question.entity";
import Question from "../../entities/interfaces/interface.question.entity";
import IUploadRepository from "../../services/file/interface.file.storage.service";
import { QuestionMultipleChoiceType, QuestionShortAnswerType, QuestionSortKeys, QuestionTopicsType, QuestionType } from "../../types/question.type";
import { QueryInput, Sort } from "../../types/repository.type";
import { CreateUseCaseResponse, FindAllUseCaseResponse, SearchUseCaseResponse, UpdateUseCaseResponse } from "../../types/usecase.type";
import { Action, Content } from "../../types/utils.type";

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
            topics,
            short_answer
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

        const entity_short_answer: QuestionShortAnswerType[] | undefined = !short_answer ? undefined : await Promise.all(short_answer.map(async (answer) => {
            let result: QuestionShortAnswerType = {
                is_correct: answer.correct,
                text: answer.text
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
            short_answers: entity_short_answer,
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

    async updateById(id: number, data: UpdateQuestionDTO): Promise<UpdateUseCaseResponse<Question>> {

        const {
            name,
            description,
            tier_level,
            content,
            multiple_choice,
            hints,
            topics,
            short_answer
        } = data;

        let question: Question;

        // Fit Data

        /**
         * @desc below we are mapping the list of data to fit the entity. we are also uploading and getting all media locations here
         */

        const entity_content: Content[] = await Promise.all(content.map(async (c) => {
            let result: Content & { to_be?: Action } = {
                type: "text",
                alt: c.alt || undefined,
                text: c.text || undefined
            }

            if(c.to_be) result.to_be = c.to_be;
            if(c.id) result.id = c.id;

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
            let result: QuestionMultipleChoiceType & { to_be?: Action } = {
                is_correct: choice.correct,
                content: {
                    type: "text",
                    text: choice.text || undefined,
                    alt: choice.alt || undefined
                }
            }

            if(choice.to_be) result.to_be = choice.to_be
            if(choice.id) result.id = choice.id

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

        const entity_short_answer: QuestionShortAnswerType[] | undefined = !short_answer ? undefined : await Promise.all(short_answer.map(async (choice) => {
            let result: QuestionShortAnswerType & { to_be?: Action } = {
                is_correct: choice.correct,
                text: choice.text
            }

            if(choice.to_be) result.to_be = choice.to_be
            if(choice.id) result.id = choice.id

            return result;
        }));

        const entity_hints: Content[] | undefined = !hints ? undefined : await Promise.all(hints.map(async (h) => {
            let result: Content & { to_be?: Action } = {
                type: "text",
                alt: h.alt || undefined,
                text: h.text || undefined
            }

            if(h.to_be) result.to_be = h.to_be
            if(h.id) result.id = h.id

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
            const result : QuestionTopicsType & { to_be?: Action } = {
                id: t.id || undefined,
                name: t.name,
                description: t.description || ""
            }

            if(t.to_be) result.to_be = t.to_be
            if(t.id) result.id = t.id

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
            short_answers: entity_short_answer,
            id
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
                message: 'Question Updated Successfully'
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