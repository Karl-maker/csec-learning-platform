import { Action } from "../../types/utils.type";

interface Topic {
    id: number | null;
    name: string;
    description: string;
    courses: ({ id:number } & { to_be?: Action })[];
}

export default Topic;