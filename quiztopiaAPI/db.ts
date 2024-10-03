
import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient} from "@aws-sdk/lib-dynamodb";
import Ajv from "ajv"


export const client = new DynamoDBClient({
});

export const docClient = DynamoDBDocumentClient.from(client);

export const ajv = new Ajv();