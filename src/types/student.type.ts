import { Action } from "./utils.type";

export type StudentType = {
    id: number | null;
    username?: string;
    school: {
        id?: string;
        name?: string;
    } & { to_be?: Action };
    points: number;
}