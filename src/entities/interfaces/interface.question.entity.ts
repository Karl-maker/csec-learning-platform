import { QuestionMultipleChoiceType, QuestionTopicsType, QuestionTypes, TipType } from "../../types/question.type";
import { Action, Content } from "../../types/utils.type";

interface Question {
    id: string | number | null;
    name: string;
    description: string;
    content: (Content & { to_be?: Action })[];
    type: QuestionTypes;
    tier_level: number;
    topics?: (QuestionTopicsType & { to_be?: Action })[];
    multiple_choice?: (QuestionMultipleChoiceType & { to_be?: Action })[] | null;
    tips?: (TipType & { to_be?: Action })[];

    isDifficultyLevelInRange(): boolean;

}

export default Question;