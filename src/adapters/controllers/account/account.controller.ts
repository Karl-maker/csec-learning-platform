import { NextFunction, Request, Response } from "express"
import AccountUseCase from "../../../usecases/account/account.usecase";
import jwt from 'jsonwebtoken';
import { SECRETS } from "../../../constants";
import { UnauthorizedError } from "../../../utils/error";

export default {
    login
}

function login(usecase: AccountUseCase) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const { username, password } = req.body;
        const secret = SECRETS.JWT.LOGIN;

        try{
            const result = await usecase.login(username, password);
            if(!result) throw new UnauthorizedError('Incorrect password or username');
            const token = jwt.sign({ sub: result?.id }, secret);
            res.json(token);
        } catch(err) {
            next(err)
        }
    }
}
