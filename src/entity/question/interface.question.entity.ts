import { QuestionMultipleChoiceType, QuestionTopicsType, QuestionType, TipType } from "../../types/question.type";
import { Content } from "../../types/utils.type";

interface IQuestion {
    id: string | number | null;
    name: string;
    description: string;
    content: Content[];
    tier_level: number;
    topics?: QuestionTopicsType[];
    tips?: TipType[];

    isDifficultyLevelInRange(): boolean;
}

export default IQuestion;