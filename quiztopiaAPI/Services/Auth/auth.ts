import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { responseHandler } from "../ResponseHandler/responseHandler";
import { userObject } from "../../Types/types";
import { APIGatewayProxyEvent } from "aws-lambda";
import { Context } from "vm";


export const signToken = async (user: userObject) => {
    if(!process.env.SECRET){
        throw new Error("JWT secret is not defined in env");
    }

    const token = jwt.sign({ userName: user.userName }, process.env.SECRET, {
        expiresIn: "1h",
        algorithm: "HS256",
    });

    return token;
}


export const validateToken = {
    before: async (request: {event: APIGatewayProxyEvent, context: Context}) => {
        let statusCode = 0;
    console.log("REQUEST IN VALIDATE", request);
        try {

            if(!process.env.SECRET){
                throw new Error("JWT secret is not defined in env");
            }
            if(!request.event.headers.authorization){
                statusCode = 400;
                throw new Error("No token provided");
            }

            const token = request.event.headers.authorization.replace("Bearer ", "");
            console.log("TOKENTOKEN", token)

            const data: any = jwt.verify(token, process.env.SECRET);
            console.log("DATATATA", data)
            if(!data || !data.userName){
                statusCode = 401;
                throw Error("Invalid token data")
            }
           
            request.context.userName = data.userName;


        } catch (error) {
            if(error instanceof JsonWebTokenError){
                return responseHandler(401, {message: "Invalid token!"})
            }

            if(error instanceof TokenExpiredError){
                return responseHandler(401, {message: "Token has expired!"})
            }

            console.log("error in validate", error);
            return responseHandler(statusCode ,{message: error.message || "Token validation failed"});
        }
    }
}

