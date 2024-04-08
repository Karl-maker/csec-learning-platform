import express from 'express';
import dotenv from 'dotenv';
import { ROUTES } from '../../constants';
import logger from '../../utils/loggers/logger.util';
import passport from 'passport';
import { basicJwtStrategy } from '../../services/passport/basic.jwt.strategy.service';
import AccountUseCase from '../../usecases/account/account.usecase';
import PrismaAccountRepository from '../../adapters/repositories/prisma/prisma.account.repsitory';
import { PrismaClient } from '@prisma/client';

// Routes
import * as QuestionRoutes from '../../adapters/presenters/routes/question.routes';
import * as QuizRoutes from '../../adapters/presenters/routes/quiz.routes';
import * as AccountRoutes from '../../adapters/presenters/routes/account.routes';
import * as StudentRoutes from '../../adapters/presenters/routes/student.routes';

dotenv.config(); // for process.env to work!

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const prisma = new PrismaClient();

passport.use(basicJwtStrategy(new AccountUseCase(new PrismaAccountRepository(prisma))));

app.use(express.json())
app.use(ROUTES.QUIZ, QuizRoutes.default);
app.use(ROUTES.QUESTION, QuestionRoutes.default);
app.use(ROUTES.ACCOUNT, AccountRoutes.default);
app.use(ROUTES.STUDENT, StudentRoutes.default);

app.get('/protected', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({ message: 'You are authorized to access this resource' });
});

app.listen(PORT, () => logger.info("🚀 server running on port: " + PORT + ""))