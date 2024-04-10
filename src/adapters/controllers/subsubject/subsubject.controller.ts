import { NextFunction, Request, Response } from "express"
import SubSubjectUseCase from "../../../usecases/subsubject/subsubject.usecase";
import UpdateSubSubjectDTO from "../../presenters/dto/subsubject/subsubject.update.dto";
import CreateSubSubjectDTO from "../../presenters/dto/subsubject/subsubject.create.dto";

export default {
    create,
    findAll,
    updateById,
    findBySubject
}

function findAll(usecase: SubSubjectUseCase) {
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

function findBySubject(usecase: SubSubjectUseCase) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try{
            const { page_number, page_size, order, field, topics } = req.query;
            const result = await usecase.findBySubject(Number(req.params.subject_id), {
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

function updateById(usecase: SubSubjectUseCase) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const data: UpdateSubSubjectDTO = req.body;
        const id: number = Number(req.params.subsubject_id);
        try{
            const result = await usecase.updateById(id, data);
            res.json(result);
        } catch(err) {
            next(err)
        }
    }
}

function create(usecase: SubSubjectUseCase) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const data: CreateSubSubjectDTO = req.body;
        
        try{
            const result = await usecase.create(data);
            res.json(result);
        } catch(err) {
            next(err)
        }
    }
}
