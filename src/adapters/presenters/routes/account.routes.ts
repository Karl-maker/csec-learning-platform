import { Router } from "express";
import controller from "../../controllers/account/account.controller";
import { PrismaClient } from "@prisma/client";
import AccountRepository from "../../repositories/interfaces/interface.account.repository";
import PrismaAccountRepository from "../../repositories/prisma/prisma.account.repsitory";
import AccountUseCase from "../../../usecases/account/account.usecase";

const routes = Router();
const prisma = new PrismaClient();
const repository: AccountRepository<PrismaClient> = new PrismaAccountRepository(prisma);
const usecase = new AccountUseCase(repository);

routes.post('/login', controller.login(usecase));

export default routes;