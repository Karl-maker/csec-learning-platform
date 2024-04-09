import { NextFunction, Request, Response } from "express"
import SubjectUseCase from "../../../usecases/subject/subject.usecase";
import CreateSubjectDTO from "../../presenters/dto/subject/subject.create.dto";
import UpdateSubjectDTO from "../../presenters/dto/subject/subject.update.dto";

export default {
    create,
    findAll,
    updateById
}

function findAll(usecase: SubjectUseCase) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try{
            const { page_number, page_size, order, field, topics } = req.query;
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

function updateById(usecase: SubjectUseCase) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const data: UpdateSubjectDTO = req.body;
        const id: number = Number(req.params.subject_id);
        try{
            const result = await usecase.updateById(id, data);
            res.json(result);
        } catch(err) {
            next(err)
        }
    }
}

function create(usecase: SubjectUseCase) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const data: CreateSubjectDTO = req.body;
        
        try{
            const result = await usecase.create(data);
            res.json(result);
        } catch(err) {
            next(err)
        }
    }
}
