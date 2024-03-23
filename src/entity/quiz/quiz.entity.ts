import { QuestionBeforeSavedType, QuestionMultipleChoiceType, QuestionTopicsType, QuestionType, TipType } from "../../types/question.type";
import { QuizQuestion } from "../../types/quiz.type";
import { Content } from "../../types/utils.type";
import Question from "../question/question.entity";

/**
 * @desc Entity type for Questions
 */

export default class Quiz {
    public id: number | null;
    public questions: QuizQuestion[];
    public started_at: Date;

    constructor(data: QuestionBeforeSavedType | QuestionType) {
        this.id = ('id' in data) ? data.id : null; 
        this.name = data.name;
        this.description = data.description;
        this.content = data.content;
        this.tier_level = data.tier_level;
        this.multiple_choice = data.multiple_choices || null;
        this.topics = data.topics || [];
        this.tips = data.tips || [];
    }

}
