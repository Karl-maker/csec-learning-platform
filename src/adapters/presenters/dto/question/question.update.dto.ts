import { Action } from "../../../../types/utils.type";

interface UpdateQuestionDTO {
    name: string;
    description: string;
    tier_level: number;
    content: Array<{
        id?: number;
        alt?: string;
        text?: string;
        image?: Buffer | null;
        video?: Buffer | null;
        audio?: Buffer | null;
        to_be?: Action;
    }>;

    multiple_choice?: Array<{
        id?: number;
        alt?: string;
        text?: string;
        image?: Buffer | null;
        video?: Buffer | null;
        audio?: Buffer | null;
        correct: boolean;
        to_be?: Action;
    }>;

    hints?: Array<{
        id?: number;
        text?: string;
        alt?: string;
        image?: Buffer | null;
        video?: Buffer | null;
        audio?: Buffer | null;
        to_be?: Action;
    }>;

    topics: Array<{
        id?: number;
        name: string;
        description?: string;
        to_be?: Action;
    }>;
}

export default UpdateQuestionDTO;
