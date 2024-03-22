import { Prisma } from "@prisma/client";
import Question from "../../entity/question/question.entity";
import { Content, ContentType } from "../../types/utils.type";
import { QuestionMultipleChoiceType, QuestionTopicsType, TipType } from "../../types/question.type";

export function fitQuestionEntityToPrismaCreateInput(question: Question): Prisma.QuestionCreateInput {
    
    /**
     * @desc create content for question
     */

    const content = question.content.map((c) => {
        const response: {
            text: null | string;
            type: string;
            url: null | string;
        } = {
            text: null,
            type: '',
            url: null
        };
        response.type = c.type;
        if(c.url) response.url = c.url;
        if(c.text) response.text = c.text;
        return response;
    })

    /**
     * @desc create answers for question
     */

    const multiple_choice = question.multiple_choice ? question.multiple_choice.map((m) => {
        const response: {
            text: null | string;
            type: string;
            url: null | string;
            correct: boolean;
        } = {
            text: null,
            type: '',
            url: null,
            correct: false
        };
        response.type = m.content.type;
        response.correct = m.is_correct
        if(m.content.url) response.url = m.content.url;
        if(m.content.text) response.text = m.content.text;
        return response;
    }) : null;

    /**
     * @desc Connect OR Create Tips / Hints
     */

    const hints = question.tips ? question.tips.map((tip) => {
        let response: {
            hint: {
                connect?: {
                    id: number;
                };
                create?: {
                    text: string | null;
                    url: string | null;
                    type: string;
                };
            };
        };

        response = ('id' in tip) ? { 
            hint: { 
                connect: { id: tip.id as number } 
            } 
        } : {
            hint: { 
                create: { 
                    text: tip.text || null,
                    url: tip.url || null,
                    type: tip.type
                } 
            }   
        }

        return response
    }) : [];

    /**
     * @desc Connect OR Create Topics
     */

    const topics = question.topics ? question.topics.map((topic) => {
        let response: {
            topic: {
                connect?: {
                    id: number;
                };
                create?: {
                    name: string;
                    description: string;
                };
            };
        };

        response = ('id' in topic) ? { 
            topic: { 
                connect: { id: topic.id as number } 
            } 
        } : {
            topic: { 
                create: { 
                    name: topic.name,
                    description: topic.description,
                } 
            }   
        }

        return response
    }) : [];

    return {
        name: question.name,
        description: question.description,
        tier_level: question.tier_level,
        content: {
            create: content
        },
        multiple_choice_answers: {
            create: multiple_choice ? multiple_choice : []
        },
        hints: {
            create: hints
        },
        topics: {
            create: topics
        }
    }
    

}

export function fitQuestionPrismaRepositoryToEntity(question: {
    id: number;
    name: string;
    description: string;
    tier_level: number;
    created_at: Date;
    content: {
        id: number;
        text: string | null;
        url: string | null;
        type: string;
        question_id: number;
        created_at: Date;
    }[];
    multiple_choice_answers: {
        id: number;
        text: string | null;
        url: string | null;
        type: string;
        correct: boolean;
        question_id: number;
        created_at: Date;
    }[];
    hints?: ({
        hint: {
            id: number;
            text: string | null;
            url: string | null;
            type: string;
            created_at: Date;
        };
    } & {
        hint_id: number;
        question_id: number;
        assigned_at: Date;
    })[];
    topics?: ({
        topic: {
            id: number;
            name: string;
            description: string;
            created_at: Date;
        };
    } & {
        question_id: number;
        topic_id: number;
        assigned_at: Date;
    })[];
}): Question {

    const content: Content[] = question.content.map((c) => {
        const result: Content = {
            id: c.id,
            type: c.type as ContentType,
        }

        if(c.text) result.text = c.text
        if(c.url) result.url = c.url

        return result
    });

    const topics: QuestionTopicsType[] = question.topics ? question.topics.map((t) => {
        return {
            id: t.topic.id,
            name: t.topic.name,
            description: t.topic.description
        }
    }) : [];

    const multiple_choices: QuestionMultipleChoiceType[] | undefined = question.multiple_choice_answers ? question.multiple_choice_answers.map((m) => {
        const result: QuestionMultipleChoiceType = {
            is_correct: m.correct,
            content: {
                type: m.type as ContentType
            }
        }

        if(m.url) result.content.url = m.url;
        if(m.text) result.content.text = m.text;

        return result;
    }) : undefined;

    const tips: TipType[] | undefined = question.hints ? question.hints.map((h) => {
        const result: TipType = {
            id: h.hint.id,
            type: h.hint.type as ContentType
        };

        if(h.hint.text) result.text = h.hint.text;
        if(h.hint.url) result.url = h.hint.url;

        return result;
    }) : undefined

    return new Question({
        content,
        topics,
        multiple_choices,
        tips,
        tier_level: question.tier_level,
        id: question.id,
        name: question.name,
        description: question.description,
    })
}