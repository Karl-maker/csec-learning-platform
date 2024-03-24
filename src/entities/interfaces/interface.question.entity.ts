import { QuestionMultipleChoiceType, QuestionTopicsType, QuestionType, TipType } from "../../types/question.type";
import { Content } from "../../types/utils.type";

interface Question {
    id: string | number | null;
    name: string;
    description: string;
    content: Content[];
    tier_level: number;
    topics?: QuestionTopicsType[];
    multiple_choice?: QuestionMultipleChoiceType[] | null;
    tips?: TipType[];

    isDifficultyLevelInRange(): boolean;

}

export default Question;