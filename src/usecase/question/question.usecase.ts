import QuestionRepository from "../../adapters/repositories/question/question.repository";
import Question from "../../entity/question/question.entity";
import { CreateQuestionUseCaseResponse, QuestionBeforeSavedType } from "../../types/question.type";

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
}