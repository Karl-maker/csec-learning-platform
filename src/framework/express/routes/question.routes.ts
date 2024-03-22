import { Router } from "express";
import controller from "../../../adapters/controllers/question/question.controller";
import PrismaQuestionRepository from "../../../adapters/repositories/question/prisma.question.repository";
import QuestionUseCase from "../../../usecase/question/question.usecase";
import IQuestionRepository from "../../../adapters/repositories/question/interface.question.respository";

const routes = Router();
const repository: IQuestionRepository = new PrismaQuestionRepository();
const usecase = new QuestionUseCase(repository);;

routes.post('/', controller.create(usecase));

export default routes;