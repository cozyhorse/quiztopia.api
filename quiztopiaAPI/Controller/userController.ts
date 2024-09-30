import { APIGatewayEvent, APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { responseHandler } from "../Services/ResponseHandler/responseHandler";
import { createUser, loginUser } from "../Services/User/userServices";
import { log } from "console";



export const addUser = async (event: APIGatewayProxyEvent, context): Promise<APIGatewayProxyResult> => {
    try {
        const body = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        const {username, password} = body;
         if(!username){
            return responseHandler(400, {message: "No username entered"})
         }
         
         if(!password){
            return responseHandler(400, {message: "No password entered"})
         }

         const user = await createUser(username, password);
         if(!user){
            return responseHandler(400, {message:"Signup failed"})
         }

         return responseHandler(200, {message: "User created!"})

        
    } catch (error) {
        console.error("Failed in route  addUser", error)
        return responseHandler(500, {message: "Internal server error"})
        
    }


}


export const login = async (event: APIGatewayProxyEvent, context): Promise<APIGatewayProxyResult> => {
   try {
      const body = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
      const { username, password } = body

      const isLoggedIn = await loginUser(username,password)

      if("success" in isLoggedIn){
         if(!isLoggedIn.success){
            return responseHandler(401, {message: "Login failed"})
         }else{
            return responseHandler(200, {loggedIn: true, token: isLoggedIn.token})
         }
      }else{
         console.log("Response is an API Gateway results", isLoggedIn)
         return responseHandler(400, {message: "Login failed"})
      }
      
      
   } catch (error) {
      console.error("ERROR IN LOGIN CONTROLLER", error);
      return responseHandler(500, {message: "Internal server error"})
   }
}