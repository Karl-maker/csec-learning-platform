import { QuestionBeforeSavedType, QuestionMultipleChoiceType, QuestionTopicsType, QuestionType, TipType } from "../../types/question.type";
import { Content } from "../../types/utils.type";

/**
 * @desc Entity type for Questions
 */

export default class Question {
    public id: string | number | null;
    public name: string;
    public description: string;
    public content: Content[];
    public tier_level: number;
    public multiple_choice: QuestionMultipleChoiceType[] | null;
    public topics?: QuestionTopicsType[];
    public tips?: TipType[];

    constructor(data: QuestionBeforeSavedType | QuestionType) {
        this.id = ('id' in data) ? data.id : null; 
        this.name = data.name;
        this.description = data.description;
        this.content = data.content;
        this.tier_level = data.tier_level;
        this.multiple_choice = data.multiple_choices || null;
        this.topics = data.topics;
        this.tips = ('tips' in data) ? data.tips : [];
    }

    /**
     * @desc Important for difficulty level to be between 1 - 20.
     */

    isDifficultyLevelInRange(): boolean {
        if(this.tier_level > 0 && this.tier_level <= 20) return true;
        return false;
    }

}
