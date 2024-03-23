import { QuestionBeforeSavedType, QuestionMultipleChoiceType, QuestionTopicsType, QuestionType, TipType } from "../../types/question.type";
import { Content } from "../../types/utils.type";

abstract class AbstractQuestion {
    id: string | number | null;
    name: string;
    description: string;
    content: Content[];
    tier_level: number;
    topics?: QuestionTopicsType[];
    tips?: TipType[];

    constructor(data: QuestionBeforeSavedType | QuestionType) {
        this.id = ('id' in data) ? data.id : null; 
        this.name = data.name;
        this.description = data.description;
        this.content = data.content;
        this.tier_level = data.tier_level;
        this.topics = data.topics || [];
        this.tips = data.tips || [];
    }

    isDifficultyLevelInRange(): boolean {
        return this.tier_level > 0 && this.tier_level <= 20;
    }
}

export default AbstractQuestion;
