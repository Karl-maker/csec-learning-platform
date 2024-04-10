import { Router } from "express";
import controller from "../../controllers/topic/topic.controller";
import { PrismaClient } from "@prisma/client";
import TopicRepository from "../../repositories/interfaces/interface.topic.repository";
import PrismaTopicRepository from "../../repositories/prisma/prisma.topic.repository";
import TopicUseCase from "../../../usecases/topic/topic.usecase";

const routes = Router();
const prisma = new PrismaClient();
const repository: TopicRepository<PrismaClient> = new PrismaTopicRepository(prisma);
const usecase = new TopicUseCase(repository);

routes.post('/', controller.create(usecase));
routes.get('/', controller.findAll(usecase));
routes.get('/course/:course_id', controller.findByCourse(usecase));
routes.put('/:topic_id', controller.updateById(usecase));

export default routes;