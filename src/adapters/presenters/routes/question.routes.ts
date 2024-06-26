import { Router } from "express";
import controller from "../../controllers/question/question.controller";
import PrismaQuestionRepository from "../../repositories/prisma/prisma.question.repository";
import QuestionUseCase from "../../../usecases/question/question.usecase";
import QuestionRepository from "../../repositories/interfaces/interface.question.repository";
import { PrismaClient } from "@prisma/client";
import FileSystemRepository from "../../../services/file/system.file.storage.service";

const routes = Router();
const prisma = new PrismaClient();
const fileRepository = new FileSystemRepository();
const repository: QuestionRepository<PrismaClient> = new PrismaQuestionRepository(prisma);
const usecase = new QuestionUseCase(repository, fileRepository);

routes.post('/', controller.create(usecase));
routes.put('/:question_id', controller.updateById(usecase));
routes.get('/', controller.findAll(usecase));
routes.get('/search', controller.search(usecase));

export default routes;