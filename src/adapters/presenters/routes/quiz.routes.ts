import { Router } from "express";
import controller from "../../controllers/quiz/quiz.controller";
import PrismaQuestionRepository from "../../repositories/prisma/prisma.question.repository";
import QuestionRepository from "../../repositories/interfaces/interface.question.respository";
import { PrismaClient } from "@prisma/client";
import QuizRepository from "../../repositories/interfaces/interface.quiz.repository";
import PrismaQuizRepository from "../../repositories/prisma/prisma.quiz.repository";
import QuizUseCase from "../../../usecases/quiz/quiz.usecase";

const routes = Router();
const prisma = new PrismaClient();
const questionRepository: QuestionRepository<PrismaClient> = new PrismaQuestionRepository(prisma);
const quizRepository: QuizRepository<PrismaClient> = new PrismaQuizRepository(prisma);
const usecase = new QuizUseCase(quizRepository, questionRepository);

routes.post('/', controller.generate(usecase));

export default routes;