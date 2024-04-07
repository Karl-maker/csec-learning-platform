import { Action } from "../../types/utils.type";

interface Student {
    id: number | null;
    username: string | null;
    school: {
        id?: string;
        name?: string;
    } & { to_be?: Action };
    points: number;
}

export default Student;