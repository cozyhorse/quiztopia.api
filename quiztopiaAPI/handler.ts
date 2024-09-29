import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";
import { returnTest } from "./Services/testservice";

export const hello = async (event: APIGatewayProxyEvent):Promise<APIGatewayProxyResult> => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: returnTest().toUpperCase(),
    }),
  };
};
