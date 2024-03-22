import { Router } from "express";
import controller from "../../../adapters/controllers/question/question.controller";
import PrismaQuestionRepository from "../../../adapters/repositories/question/prisma.question.repository";
import QuestionUseCase from "../../../usecase/question/question.usecase";
import IQuestionRepository from "../../../adapters/repositories/question/interface.question.respository";
import { PrismaClient } from "@prisma/client";

const routes = Router();
const prisma = new PrismaClient()
const repository: IQuestionRepository<PrismaClient> = new PrismaQuestionRepository(prisma);
const usecase = new QuestionUseCase(repository);

routes.post('/', controller.create(usecase));
routes.get('/', controller.findAll(usecase));

export default routes;