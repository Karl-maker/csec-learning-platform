interface CreateQuestionDTO {
    name: string;
    description: string;
    tier_level: number;
    content: Array<{
        alt?: string;
        text?: string;
        image?: Buffer | null;
        video?: Buffer | null;
        audio?: Buffer | null;
    }>;

    multiple_choice?: Array<{
        alt?: string;
        text?: string;
        image?: Buffer | null;
        video?: Buffer | null;
        audio?: Buffer | null;
        correct: boolean;
    }>;

    hints?: Array<{
        id?: number;
        text?: string;
        alt?: string;
        image?: Buffer | null;
        video?: Buffer | null;
        audio?: Buffer | null;
    }>;

    topics: Array<{
        id?: number;
        name: string;
        description?: string;
    }>;
}

export default CreateQuestionDTO;
