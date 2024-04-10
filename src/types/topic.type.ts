import { Prisma } from "@prisma/client";
import { Action } from "./utils.type";

export type TopicType = {
    id: null | number;
    name: string;
    description: string;
    courses: ({ id:number } & { to_be?: Action })[];
}

export type TopicSortKeys = 'id' | 'created_at';

const TopicPrismaModel = Prisma.validator<Prisma.TopicDefaultArgs>()({
    include: {
        courses: true
    }
})

export type TopicPrismaModelType = typeof TopicPrismaModel;