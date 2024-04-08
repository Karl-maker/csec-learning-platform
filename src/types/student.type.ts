import { Prisma } from "@prisma/client";
import { Action } from "./utils.type";

export type StudentType = {
    id: number | null;
    username?: string;
    school: {
        id?: number;
        name?: string;
    } & { to_be?: Action };
    points?: number;
    account_id: number;
    grade: number;
}

const StudentPrismaModel = Prisma.validator<Prisma.StudentDefaultArgs>()({
    include: { school: true },
})

export type StudentPrismaModelType = typeof StudentPrismaModel;