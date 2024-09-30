import { PutCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import bcrypt from "bcryptjs"
import { docClient } from "../../db";
import { responseHandler } from "../ResponseHandler/responseHandler";
import { checkPassword } from "../Validation/validationServices";
import { signToken } from "../Auth/auth";



const hashPassword = async (password: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  return hashedPassword;
}

export const createUser = async (userName: string, password: string) => {
  try {
    const modifiedPassword = await hashPassword(password);
    console.log("PASSWORD HASHED", modifiedPassword);

    const command = new PutCommand({
      TableName: process.env.USER_TABLE,
      Item: {
        userName: userName,
        password: modifiedPassword,
      },
    });

    const userResponse = await docClient.send(command);
    console.log("USERRESPONSE", userResponse);
    return true;
  } catch (error) {
    console.log("ERROR IN addUser.mjs", error);
    return false;
  }
};


export const getUser = async (item: string) => {
    try {
        const command = new GetCommand({
            TableName: process.env.USER_TABLE,
            Key: {
                userName: item
            },
        });

        const getResponse = await docClient.send(command);
        console.log("GETRESPONSE", getResponse);

        const returnObject = {
            userName: getResponse.Item?.userName,
            password: getResponse.Item?.password
        }
        console.log("RETURNOBJECT", returnObject);
        return returnObject;
         
    } catch (error) {
        console.log("ERROR IN GET USERID", error);
        
    }

}


export const loginUser = async (userNameValue: string, passwordValue: string) => {
    try {
        const user = await getUser(userNameValue);
        if(!user){
            return responseHandler(404, {message: "Invalid user"})
        }

        const isPasseword = await checkPassword(passwordValue, user)
        if(!isPasseword){
            return responseHandler(401, {message: "invalid password"})
        }

        const token = await signToken(user);
        console.log("TOKEN", token);
        
        return { success: true, token }  
        
    } catch (error) {
        console.error("ERROR IN loginUser", error);
        return responseHandler(500, {message: "error in loginUser"})
    }
}

