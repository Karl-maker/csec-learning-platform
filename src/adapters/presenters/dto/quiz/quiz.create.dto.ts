interface CreateQuizDTO {
    tier_level: number;
    topics: Array<number>;
    range: number;
    amount_of_questions: number;
    questions?: number[];
}

export default CreateQuizDTO;
