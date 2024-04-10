import { Action } from "../../../../types/utils.type";

interface UpdateTopicDTO {
    name: string;
    description: string;
    courses: {
        id: number;
        to_be?: Action
    }[];
}

export default UpdateTopicDTO;