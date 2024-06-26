import { NextFunction, Request, Response } from "express"
import QuestionUseCase from "../../../usecases/question/question.usecase"
import CreateQuestionDTO from "../../presenters/dto/question/question.create.dto";
import UpdateQuestionDTO from "../../presenters/dto/question/question.update.dto";

export default {
    create,
    findAll,
    search,
    updateById
}

function create(usecase: QuestionUseCase) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const data: CreateQuestionDTO = req.body;
        try{
            const result = await usecase.create(data);
            res.json(result);
        } catch(err) {
            next(err)
        }
    }
}

function updateById(usecase: QuestionUseCase) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const data: UpdateQuestionDTO = req.body;
        const id: number = Number(req.params.question_id);
        try{
            const result = await usecase.updateById(id, data);
            res.json(result);
        } catch(err) {
            next(err)
        }
    }
}

function findAll(usecase: QuestionUseCase) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try{
            const { page_number, page_size, order, field, topics } = req.query;
            const result = await usecase.findAll({
                topics: topics ? [String(topics)] : null,
            }, {
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

function search(usecase: QuestionUseCase) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try{
            const { page_number, page_size, order, field, q } = req.query;
            const result = await usecase.search(String(q) || "", {
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
