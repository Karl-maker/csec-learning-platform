import { NextFunction, Request, Response } from "express"
import TopicUseCase from "../../../usecases/topic/topic.usecase";
import UpdateTopicDTO from "../../presenters/dto/topic/topic.update.dto";
import CreateTopicDTO from "../../presenters/dto/topic/topic.create.dto";

export default {
    create,
    findAll,
    updateById,
    findByCourse
}

function findAll(usecase: TopicUseCase) {
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

function findByCourse(usecase: TopicUseCase) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try{
            const { page_number, page_size, order, field } = req.query;
            const result = await usecase.findByCourse(Number(req.params.course_id), {
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

function updateById(usecase: TopicUseCase) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const data: UpdateTopicDTO = req.body;
        const id: number = Number(req.params.topic_id);
        try{
            const result = await usecase.updateById(id, data);
            res.json(result);
        } catch(err) {
            next(err)
        }
    }
}

function create(usecase: TopicUseCase) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const data: CreateTopicDTO = req.body;
        
        try{
            const result = await usecase.create(data);
            res.json(result);
        } catch(err) {
            next(err)
        }
    }
}
