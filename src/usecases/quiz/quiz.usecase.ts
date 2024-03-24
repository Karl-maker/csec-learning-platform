import QuizRepository from "../../adapters/repositories/interfaces/interface.quiz.repository";
import Quiz from "../../entities/interfaces/interface.quiz.entity";
import IUploadRepository from "../../services/file/interface.file.storage.service";

export default class QuestionUseCase {
    private repository: QuizRepository<Quiz>;

    constructor(repository: QuizRepository<Quiz>) {
        this.repository = repository; 
    }

    
}