import { Router } from "express";
import controller from "../../controllers/course/course.controller";
import { PrismaClient } from "@prisma/client";
import CourseRepository from "../../repositories/interfaces/interface.course.repository";
import CourseUseCase from "../../../usecases/course/course.usecase";
import PrismaCourseRepository from "../../repositories/prisma/prisma.course.repository";

const routes = Router();
const prisma = new PrismaClient();
const repository: CourseRepository<PrismaClient> = new PrismaCourseRepository(prisma);
const usecase = new CourseUseCase(repository);

routes.post('/', controller.create(usecase));
routes.get('/', controller.findAll(usecase));
routes.get('/subject-breakdown/:subsubject_id', controller.findBySubSubject(usecase));
routes.put('/:course_id', controller.updateById(usecase));

export default routes;