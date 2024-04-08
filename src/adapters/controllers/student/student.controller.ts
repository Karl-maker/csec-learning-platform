import { NextFunction, Request, Response } from "express"
import AccountUseCase from "../../../usecases/account/account.usecase";
import jwt from 'jsonwebtoken';
import { SECRETS } from "../../../constants";
import { UnauthorizedError, UnexpectedError } from "../../../utils/error";
import CreateAccountDTO from "../../presenters/dto/account/account.create.dto";
import StudentUseCase from "../../../usecases/student/student.usecase";
import CreateStudentDTO from "../../presenters/dto/student/student.create.dto";

export default {
    create,
    findByAccount
}

function findByAccount(usecase: StudentUseCase) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.account_id;

        try{
            const result = await usecase.findByAccount(Number(id));
            if(!result) throw new UnauthorizedError('Student not found');
            res.json(result);
        } catch(err) {
            next(err)
        }
    }
}

function create(usecase: StudentUseCase) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const data: CreateStudentDTO = req.body;
        if(!req.user) throw new UnexpectedError('No user found in request');
        const account = 'id' in req.user ? req.user.id : null;
        
        try{
            const result = await usecase.create(Number(account), data);
            res.json(result);
        } catch(err) {
            next(err)
        }
    }
}
