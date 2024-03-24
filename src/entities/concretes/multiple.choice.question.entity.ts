import { QuestionType } from "../../types/question.type";
import AbstractQuestion from "../abstracts/abstract.question.entity";
import Question from "../interfaces/interface.question.entity";
/**
 * @desc Entity type for Questions
 */

export default class MultipleChoiceQuestion extends AbstractQuestion implements Question {
    constructor(data: QuestionType) {
        super(data)
    }
}
