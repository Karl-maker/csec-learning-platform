interface UpdateQuestionDTO {
    name?: string;
    description?: string;
    tier_level?: number;
    content?: Array<{
        id?: number;
        alt?: string;
        text?: string;
        image?: Buffer | null;
        video?: Buffer | null;
        audio?: Buffer | null;
    }>;

    multiple_choice?: Array<{
        id?: number;
        alt?: string;
        text?: string;
        image?: Buffer | null;
        video?: Buffer | null;
        audio?: Buffer | null;
        correct: boolean;
    }>;
}

export default UpdateQuestionDTO;
