import { NextFunction, Request, Response } from "express"
import Question from "../../../entity/question/question.entity"
import QuestionUseCase from "../../../usecase/question/question.usecase"
import QuestionRepository from "../../repositories/question/prisma.question.repository"
import { QuestionDTO } from "../../presenters/dto/question/question.create.dto";
import logger from "../../../utils/loggers/logger.util";
import { QuestionSortKeys } from "../../../types/question.type";

export default {
    create,
    findAll
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

function findAll(usecase: QuestionUseCase) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try{
            const { page_number, page_size, order, field } = req.query;
            const result = await usecase.findAll({}, {
                page: {
                    number: Number(page_number) || 1,
                    size: Number(page_size) || 10
                },
                field: {
                    order: order !== 'asc' && order !== 'desc' ? "asc" : order,
                    key: field !== 'created_at' && field !== 'id' ? 'created_at' : field
                }
            });
            res.json(result);
        } catch(err) {
            next(err)
        }
    }
}