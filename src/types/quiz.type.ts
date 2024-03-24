export type QuizType = {
    type: QuizTypes;
    tier_level: number;
    topics: string[];
    range: number;
}

export type QuizTypes = 'generated' | 'manual';