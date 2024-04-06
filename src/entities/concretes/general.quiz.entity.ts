import { QuizType } from "../../types/quiz.type";
import AbstractQuiz from "../abstracts/abstract.quiz.entity";
import Quiz from "../interfaces/interface.quiz.entity";
/**
 * @desc Entity type for Quiz
 */

export default class BasicQuiz extends AbstractQuiz implements Quiz {
    constructor(data: QuizType) {
        super(data)
    }
}
