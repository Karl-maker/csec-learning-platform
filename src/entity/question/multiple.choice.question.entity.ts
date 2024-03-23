import { QuestionBeforeSavedType, QuestionMultipleChoiceType, QuestionType } from "../../types/question.type";
import AbstractQuestion from "./abstract.question.entity";
import IQuestion from "./interface.question.entity";

/**
 * @desc Entity type for Questions
 */

export default class MultipleChoiceQuestion extends AbstractQuestion implements IQuestion {
    public multiple_choice: QuestionMultipleChoiceType[] | null;
    constructor(data: QuestionBeforeSavedType | QuestionType) {
        super(data)
        this.multiple_choice = data.multiple_choices || null;
    }
}
