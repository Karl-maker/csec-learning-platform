import { NextFunction, Request, Response } from "express"
import QuizUseCase from "../../../usecases/quiz/quiz.usecase";
import CreateQuizDTO from "../../presenters/dto/quiz/quiz.create.dto";

export default {
    generate
}

function generate(usecase: QuizUseCase) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const data: CreateQuizDTO = req.body;
        try{
            const result = await usecase.generate(data);
            res.json(result);
        } catch(err) {
            next(err)
        }
    }
}
