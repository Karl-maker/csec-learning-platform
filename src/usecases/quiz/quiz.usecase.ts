import CreateQuizDTO from "../../adapters/presenters/dto/quiz/quiz.create.dto";
import QuestionRepository from "../../adapters/repositories/interfaces/interface.question.repository";
import QuizRepository from "../../adapters/repositories/interfaces/interface.quiz.repository";
import { VALUES } from "../../constants";
import BasicQuiz from "../../entities/concretes/basic.quiz.entity";
import Quiz from "../../entities/interfaces/interface.quiz.entity";
import { CreateUseCaseResponse } from "../../types/usecase.type";
import { generateRangeOfNumbersArray } from "../../utils/range.of.numbers";

export default class QuizUseCase {
    private quizRepository: QuizRepository<any>;
    private questionRepository: QuestionRepository<any>;

    constructor(quizRepository: QuizRepository<any>, questionRepository: QuestionRepository<any>) {
        this.quizRepository = quizRepository; 
        this.questionRepository = questionRepository;
    }

    async generate(data: CreateQuizDTO): Promise<CreateUseCaseResponse<Quiz>> {

        const {
            tier_level,
            topics,
            range,
            amount_of_questions,
            questions
        } = data;

        const quiz = new BasicQuiz({
            id: null,
            type: !questions ? 'generated' : 'manual',
            tier_level,
            topics: topics.map((t) => ({ id: t })),
            range,
            question_outline: questions ? questions.map((q) => ({ question_id: q })) : [],
        });

        const tierLevels = generateRangeOfNumbersArray(tier_level, range);
        const generatedQuestions = await this.questionRepository.findForQuizGeneration(tierLevels, topics, amount_of_questions);
        generatedQuestions.forEach((q) => {
            quiz.addQuestion(q);
        })

        return {
            data: quiz,
            message: `Quiz Generated Successfully`,
            success: true
        }
    }

    
}