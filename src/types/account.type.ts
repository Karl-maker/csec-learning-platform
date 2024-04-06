import { Prisma } from "@prisma/client";

export type AccountType = {
    id: number | null;
    email: string;
    password: string;
    first_name: string | null;
    last_name: string | null;
}
const AccountPrismaModel = Prisma.validator<Prisma.AccountDefaultArgs>()({
    include: { student: true },
})

export type AccountPrismaModelType = typeof AccountPrismaModel;