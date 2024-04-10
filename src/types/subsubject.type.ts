import { Prisma } from "@prisma/client";

export type SubSubjectType = {
    id: null | number;
    name: string;
    description: string;
    subject_id: number;
}

export type SubSubjectSortKeys = 'id' | 'created_at';

const SubSubjectPrismaModel = Prisma.validator<Prisma.SubjectBreakdownDefaultArgs>()({})

export type SubSubjectPrismaModelType = typeof SubSubjectPrismaModel;