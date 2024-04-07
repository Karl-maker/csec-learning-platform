import AccountUseCase from "../../usecases/account/account.usecase";
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import { UnauthorizedError } from "../../utils/error";
import { SECRETS } from "../../constants";

const secret = SECRETS.JWT.LOGIN;
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secret
};

export const basicJwtStrategy = (usecase: AccountUseCase) => {
    return new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
        try {
            const account = await usecase.findById(Number(jwtPayload.sub));
            if(!account) done(new UnauthorizedError('Unauthorized'));
            done(null, { id: account?.id });
        } catch(err) {
            done(new UnauthorizedError('Unauthorized'));
        }
    })
}