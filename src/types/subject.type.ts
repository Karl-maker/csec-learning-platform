import { Prisma } from "@prisma/client";

export type SubjectType = {
    id: null | number;
    name: string;
    description: string;
}

export type SubjectSortKeys = 'id' | 'created_at';

const SubjectPrismaModel = Prisma.validator<Prisma.SubjectDefaultArgs>()({})

export type SubjectPrismaModelType = typeof SubjectPrismaModel;