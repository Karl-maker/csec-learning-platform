import { Router } from "express";
import controller from "../../controllers/subsubject/subsubject.controller";
import { PrismaClient } from "@prisma/client";
import PrismaSubSubjectRepository from "../../repositories/prisma/prisma.subsubject.repository";
import SubSubjectRepository from "../../repositories/interfaces/interface.subsubject.repository";
import SubSubjectUseCase from "../../../usecases/subsubject/subsubject.usecase";

const routes = Router();
const prisma = new PrismaClient();
const repository: SubSubjectRepository<PrismaClient> = new PrismaSubSubjectRepository(prisma);
const usecase = new SubSubjectUseCase(repository);

routes.post('/', controller.create(usecase));
routes.get('/', controller.findAll(usecase));
routes.get('/subject/:subject_id', controller.findBySubject(usecase));
routes.put('/:subsubject_id', controller.updateById(usecase));

export default routes;