import { NextFunction, Request, Response } from "express"
import Question from "../../../entity/question/question.entity"
import QuestionUseCase from "../../../usecase/question/question.usecase"
import QuestionRepository from "../../repositories/question/prisma.question.repository"
import { QuestionDTO } from "../../presenters/dto/question/question.create.dto";
import logger from "../../../utils/loggers/logger.util";

export default {
    create
}

function create(usecase: QuestionUseCase) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const data: QuestionDTO = req.body;
        try{
            const result = await usecase.create(data);
            res.json(result);
        } catch(err) {
            next(err)
        }
    }
}