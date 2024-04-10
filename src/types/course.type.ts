import { Prisma } from "@prisma/client";

export type CourseType = {
    id: null | number;
    name: string;
    description: string;
    subsubject_id: number;
}

export type CourseSortKeys = 'id' | 'created_at';

const CoursePrismaModel = Prisma.validator<Prisma.CourseDefaultArgs>()({})

export type CoursePrismaModelType = typeof CoursePrismaModel;