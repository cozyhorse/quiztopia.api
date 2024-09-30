import { APIGatewayProxyResult } from "aws-lambda";


export const responseHandler = (status: number, object: object): APIGatewayProxyResult => {
    const response = {
        statusCode: status,
        body: JSON.stringify(object),
    };
    return response;
}