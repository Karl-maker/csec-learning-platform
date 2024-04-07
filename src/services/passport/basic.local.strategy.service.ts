import AccountUseCase from "../../usecases/account/account.usecase";
import { Strategy as LocalStrategy } from "passport-local";

export const basicLocalStrategy = (usecase: AccountUseCase) => {
    return new LocalStrategy((username, password, done) => {
        (async() => {
            try {
                const account = await usecase.login(username, password);
                if(!account) return done(null, false, { message: 'Incorrect username or password.' });
                return done(null, account);
            } catch(err) {
                return done(err);
            }

        })();
    })  
}