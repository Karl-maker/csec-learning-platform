import QuestionRepository from "../../adapters/repositories/question/prisma.question.repository";
import Question from "../../entity/question/question.entity";
import { CreateQuestionUseCaseResponse, FindAllQuestionUseCaseResponse, QuestionBeforeSavedType, QuestionSortKeys } from "../../types/question.type";
import { QueryInput, Sort } from "../../types/repository.type";

export default class QuestionUseCase {
    private repository: QuestionRepository;

    constructor(repository: QuestionRepository) {
        this.repository = repository; 
    }

    async create(data: QuestionBeforeSavedType): Promise<CreateQuestionUseCaseResponse> {
        const question = new Question(data);

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
}