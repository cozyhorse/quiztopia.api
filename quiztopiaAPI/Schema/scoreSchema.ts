import { JSONSchemaType } from "ajv";

export const scoreSchema: JSONSchemaType<{
    quizname: string,
    score: number,
}> = {
    type: "object",
    properties: {
        quizname: {type: "string", minLength: 1},
        score: {type: "number", },
    },
    required: ["quizname", "score"],
    additionalProperties: false,
}
