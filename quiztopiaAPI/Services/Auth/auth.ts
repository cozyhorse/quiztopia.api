import jwt from "jsonwebtoken";
import { responseHandler } from "../ResponseHandler/responseHandler";
import { userObject } from "../../Types/types";


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
    before: async (request) => {
    console.log("REQUEST IN VALIDATE", request);
        try {

            if(!process.env.SECRET){
                throw new Error("JWT secret is not defined in env");
            }

            const token = request.event.headers.Authorization.replace("Bearer ", "");
            console.log("TOKENTOKEN", token)
            if(!token){
                return responseHandler(401,{message: "No token"});
            }

            const data = jwt.verify(token, process.env.SECRET);
            console.log("DATATATA", data)
            if(!data){
                return responseHandler(401, {message: "no permission"});
            }


        } catch (error) {
            console.log("error in validate", error);
            return responseHandler(401,{message: "invalid token"});
        }
    }
}

