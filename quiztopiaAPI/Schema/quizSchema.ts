import { JSONSchemaType } from "ajv";

export const questionSchema: JSONSchemaType<{
    quizname: string,
    question: string,
    answer: string,
    location: {
        latitude: number,
        longitude: number
    };
}> = {
    type: "object",
    properties: {
        quizname: {type: "string", minLength: 1},
        question: {type: "string", minLength: 1},
        answer: {type: "string", minLength: 1},
        location: {
            type: "object",
            properties:{
                latitude: {type: "number"},
                longitude: {type: "number"},
            },
            required: ["latitude", "longitude",]
        }
    },
    required: ["quizname","question","answer","location"],
    additionalProperties: false
}


export const quizSchema: JSONSchemaType<{
    quizname: string;
}>={
    type: "object",
    properties: {
        quizname: {type: "string", minLength: 1}
    },
    required: ["quizname"]
}