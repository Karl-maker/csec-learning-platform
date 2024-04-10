import { TopicType } from "../../types/topic.type";
import { Action } from "../../types/utils.type";
import Topic from "../interfaces/interface.topic.entity";

abstract class AbstractTopic implements Topic {
    public id: number | null;
    public name: string;
    public description: string;
    public courses: ({ id: number; } & { to_be?: Action | undefined; })[];
    constructor(data: TopicType) {
        this.id = ('id' in data) ? data.id : null; 
        this.name = data.name;
        this.description = data.description;
        this.courses = data.courses;
    }
    
}

export default AbstractTopic;
