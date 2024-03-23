import { Router } from "express";
import controller from "../../controllers/question/question.controller";
import PrismaQuestionRepository from "../../repositories/prisma/prisma.question.repository";
import QuestionUseCase from "../../../usecases/question/question.usecase";
import IQuestionRepository from "../../repositories/interfaces/interface.question.respository";
import { PrismaClient } from "@prisma/client";
import FileSystemRepository from "../../../services/file/system.file.storage.service";

const routes = Router();
const prisma = new PrismaClient();
const fileRepository = new FileSystemRepository();
const repository: IQuestionRepository<PrismaClient> = new PrismaQuestionRepository(prisma);
const usecase = new QuestionUseCase(repository, fileRepository);

routes.post('/', controller.create(usecase));
routes.get('/', controller.findAll(usecase));
routes.get('/search', controller.search(usecase));
routes.patch('/:question_id', controller.updateById(usecase));


export default routes;