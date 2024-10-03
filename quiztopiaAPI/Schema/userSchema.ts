import { JSONSchemaType } from "ajv";

export const userSchema: JSONSchemaType<{
    username: string,
    password: string
}> = {
    type: "object",
    properties: {
        username: {type: "string", minLength: 1},
        password: {type: "string", minLength: 1},
    },
    required: ["username", "password"],
    additionalProperties: false,
}
