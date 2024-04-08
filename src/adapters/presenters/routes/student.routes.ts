import { Router } from "express";
import controller from "../../controllers/student/student.controller";
import { PrismaClient } from "@prisma/client";
import StudentUseCase from "../../../usecases/student/student.usecase";
import StudentRepository from "../../repositories/interfaces/interface.student.repository";
import PrismaStudentRepository from "../../repositories/prisma/prisma.student.repository";
import passport from 'passport';

const routes = Router();
const prisma = new PrismaClient();
const repository: StudentRepository<PrismaClient> = new PrismaStudentRepository(prisma);
const usecase = new StudentUseCase(repository);

routes.post('/', passport.authenticate('jwt', { session: false }), controller.create(usecase));
routes.get('/account/:account_id', controller.findByAccount(usecase));

export default routes;