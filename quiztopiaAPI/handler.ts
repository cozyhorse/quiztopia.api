import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";
import { returnTest } from "./Services/testservice";
import middy from "@middy/core";
import { validateToken } from "./Services/Auth/auth";

export const hello = async (event: APIGatewayProxyEvent, context: any):Promise<APIGatewayProxyResult> => {
  const userName = context.userName;

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: returnTest().toUpperCase(),
      tokenowner: userName,
    }),
  };
};

export const handler = middy(hello)
.use(validateToken)