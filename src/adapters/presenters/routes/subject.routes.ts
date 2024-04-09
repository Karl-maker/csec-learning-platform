import { Router } from "express";
import controller from "../../controllers/subject/subject.controller";
import { PrismaClient } from "@prisma/client";
import SubjectRepository from "../../repositories/interfaces/interface.subject.repository";
import PrismaSubjectRepository from "../../repositories/prisma/prisma.subject.repository";
import SubjectUseCase from "../../../usecases/subject/subject.usecase";

const routes = Router();
const prisma = new PrismaClient();
const repository: SubjectRepository<PrismaClient> = new PrismaSubjectRepository(prisma);
const usecase = new SubjectUseCase(repository);

routes.post('/', controller.create(usecase));
routes.get('/', controller.findAll(usecase));
routes.put('/:subject_id', controller.updateById(usecase));

export default routes;