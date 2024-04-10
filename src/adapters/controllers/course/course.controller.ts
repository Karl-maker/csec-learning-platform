import { NextFunction, Request, Response } from "express"
import CourseUseCase from "../../../usecases/course/course.usecase";
import UpdateCourseDTO from "../../presenters/dto/course/course.update.dto";
import CreateCourseDTO from "../../presenters/dto/course/course.create.dto";

export default {
    create,
    findAll,
    updateById,
    findBySubSubject
}

function findAll(usecase: CourseUseCase) {
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

function findBySubSubject(usecase: CourseUseCase) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try{
            const { page_number, page_size, order, field } = req.query;
            const result = await usecase.findBySubSubject(Number(req.params.subsubject_id), {
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

function updateById(usecase: CourseUseCase) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const data: UpdateCourseDTO = req.body;
        const id: number = Number(req.params.course_id);
        try{
            const result = await usecase.updateById(id, data);
            res.json(result);
        } catch(err) {
            next(err)
        }
    }
}

function create(usecase: CourseUseCase) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const data: CreateCourseDTO = req.body;
        
        try{
            const result = await usecase.create(data);
            res.json(result);
        } catch(err) {
            next(err)
        }
    }
}
