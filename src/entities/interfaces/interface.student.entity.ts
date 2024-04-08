import { Action } from "../../types/utils.type";

interface Student {
    id: number | null;
    username: string | null;
    school: {
        id?: number;
        name?: string;
    } & { to_be?: Action };
    points?: number;
    account_id: number;
    grade: number;
}

export default Student;