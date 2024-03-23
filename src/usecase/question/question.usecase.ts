import QuestionRepository from "../../adapters/repositories/question/prisma.question.repository";
import IQuestion from "../../entity/question/interface.question.entity";
import MultipleChoiceQuestion from "../../entity/question/multiple.choice.question.entity";
import Question from "../../entity/question/question.entity";
import { CreateQuestionUseCaseResponse, FindAllQuestionUseCaseResponse, QuestionBeforeSavedType, QuestionSortKeys, SearchQuestionUseCaseResponse } from "../../types/question.type";
import { QueryInput, Sort } from "../../types/repository.type";

export default class QuestionUseCase {
    private repository: QuestionRepository;

    constructor(repository: QuestionRepository) {
        this.repository = repository; 
    }

    async create(data: QuestionBeforeSavedType): Promise<CreateQuestionUseCaseResponse> {
        let question: Question;

        question = new MultipleChoiceQuestion(data);


        try {
            if(!question.isDifficultyLevelInRange()) {
                return {
                    success: false,
                    message: 'Tier level must be between 1 and 20'
                };
            };

            const result = await this.repository.save(question);
            return {
                question: result,
                success: true,
                message: 'Question Created Successfully'
            }
        } catch(err) {
            throw err;
        }
        
    };

    async findAll(query: QueryInput<Question>, sort: Sort<QuestionSortKeys>): Promise<FindAllQuestionUseCaseResponse> {
        try {
            const result = await this.repository.findAll(query, sort);
            return {
                amount: result.amount,
                questions: result.data || []
            }
        } catch(err) {
            throw err;
        }
    }

    async search(search: string, sort: Sort<QuestionSortKeys>): Promise<SearchQuestionUseCaseResponse> {
        try {
            const result = await this.repository.search(search, sort);
            return {
                amount: result.amount,
                questions: result.data || []
            }
        } catch(err) {
            throw err;
        }
    }
}