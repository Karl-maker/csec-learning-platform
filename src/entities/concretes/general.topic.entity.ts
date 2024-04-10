import { TopicType } from "../../types/topic.type";
import AbstractTopic from "../abstracts/abstract.topic.entity";
import Topic from "../interfaces/interface.topic.entity";
/**
 * @desc Entity type for Account
 */

export default class GeneralTopic extends AbstractTopic implements Topic {
    constructor(data: TopicType) {
        super(data)
    }
}
