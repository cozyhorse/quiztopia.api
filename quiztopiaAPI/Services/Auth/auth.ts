import jwt from "jsonwebtoken";
import { responseHandler } from "../ResponseHandler/responseHandler";
import { userObject } from "../../Types/types";
import { APIGatewayProxyEvent } from "aws-lambda";
import { Context } from "vm";


export const signToken = async (user: userObject) => {
    if(!process.env.SECRET){
        throw new Error("JWT secret is not defined in env");
    }

    const token = jwt.sign({ userName: user.userName }, process.env.SECRET, {
        expiresIn: "8h", //Change to 60min when live
    });

    return token;
}


export const validateToken = {
    before: async (request: {event: APIGatewayProxyEvent, context: Context}) => {
    console.log("REQUEST IN VALIDATE", request);
        try {

            if(!process.env.SECRET){
                throw new Error("JWT secret is not defined in env");
            }
            if(!request.event.headers.authorization){
                throw new Error("No token");
            }

            const token = request.event.headers.authorization.replace("Bearer ", "");
            console.log("TOKENTOKEN", token)
            if(!token){
                return responseHandler(401,{message: "No token"});
            }

            const data: any = jwt.verify(token, process.env.SECRET);
            console.log("DATATATA", data)
            if(!data){
                return responseHandler(401, {message: "no permission"});
            }

           
            request.context.userName = data.userName;


        } catch (error) {
            console.log("error in validate", error);
            return responseHandler(401,{message: "invalid token"});
        }
    }
}

