import { QuestionMultipleChoiceType, QuestionTopicsType, QuestionType, TipType } from "../../types/question.type";
import { Content } from "../../types/utils.type";
import Question from "../interfaces/interface.question.entity";

abstract class AbstractQuestion implements Question {
    public id: number | null;
    public name: string;
    public description: string;
    public content: Content[];
    public tier_level: number;
    public topics?: QuestionTopicsType[];
    public multiple_choice?: QuestionMultipleChoiceType[] | null;
    public tips?: TipType[];

    constructor(data: QuestionType) {
        this.id = ('id' in data) ? data.id : null; 
        this.name = data.name;
        this.description = data.description;
        this.content = data.content;
        this.multiple_choice = data.multiple_choices || null;;
        this.tier_level = data.tier_level;
        this.topics = data.topics || [];
        this.tips = data.tips || [];
    }

    public isDifficultyLevelInRange(): boolean {
        return this.tier_level > 0 && this.tier_level <= 20;
    }
}

export default AbstractQuestion;
