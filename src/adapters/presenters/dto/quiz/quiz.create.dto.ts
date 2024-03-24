import { QuizTypes } from "../../../../types/quiz.type";

interface CreateQuizDTO {
    type: QuizTypes;
    tier_level: number;
    topics: Array<string>;
    range: number;
    amount_of_questions: number;
}

export default CreateQuizDTO;
