import { Router } from "express";
import controller from "../../../adapters/controllers/question/question.controller";
import QuestionRepository from "../../../adapters/repositories/question/question.repository";
import QuestionUseCase from "../../../usecase/question/question.usecase";

const routes = Router();
const repository = new QuestionRepository();
const usecase = new QuestionUseCase(repository);;

routes.post('/', controller.create(usecase));

export default routes;