import CreateQuizDTO from "../../adapters/presenters/dto/quiz/quiz.create.dto";
import QuestionRepository from "../../adapters/repositories/interfaces/interface.question.respository";
import QuizRepository from "../../adapters/repositories/interfaces/interface.quiz.repository";
import BasicQuiz from "../../entities/concretes/basic.quiz.entity";
import Quiz from "../../entities/interfaces/interface.quiz.entity";
import { CreateUseCaseResponse } from "../../types/usecase.type";

export default class QuestionUseCase {
    private quizRepository: QuizRepository<any>;
    private questionRepository: QuestionRepository<any>;

    constructor(quizRepository: QuizRepository<any>, questionRepository: QuestionRepository<any>) {
        this.quizRepository = quizRepository; 
        this.questionRepository = questionRepository;
    }

    async generate(data: CreateQuizDTO): Promise<CreateUseCaseResponse<Quiz>> {

        const {
            type,
            tier_level,
            topics,
            range,
            amount_of_questions
        } = data;

        const quiz = new BasicQuiz({
            type,
            tier_level,
            topics,
            range
        });

        const generated_quiz = await this.quizRepository.generate(amount_of_questions, quiz)

        return {
            data: generated_quiz,
            message: `Quiz Generated Successfully`,
            success: true
        }
    }

    
}