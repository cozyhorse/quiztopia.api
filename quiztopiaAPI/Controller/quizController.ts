import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { addQuestionToQuiz, addQuizToTable, getAllQuizzesFromTable } from '../Services/Quiz/quizServices';
import { responseHandler } from '../Services/ResponseHandler/responseHandler';
import { validateToken } from '../Services/Auth/auth';
import middy from '@middy/core';

const addQuiz = async (event: APIGatewayProxyEvent, context: any): Promise<APIGatewayProxyResult> => {
try {
        const body = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        const {quizname} = body;
        const userName = context.userName;
        

        console.log("USERNAME", userName)
        const quiz = await addQuizToTable(quizname, userName);
        if("success" in quiz) {
            if(!quiz.success){
                return responseHandler(400, {message: "Failed to create quiz"})
            }else{
                return responseHandler(200, {message: "Quiz created"})
            }
        }else{
            console.log("Response is an API Gateway results", quiz)
            return responseHandler(500, {message: "Faild to create quiz"})
        }



    
} catch (error) {
    console.error("FAIL IN ADDQUIZ ROUTE", error)
    return responseHandler(500, {message: "Internal server error"})
}

}


const getAllQuizzes = async () => {
    try {
        const quizzes = await getAllQuizzesFromTable()
        return responseHandler(200, { quizzes })
    } catch (error) {
        console.error("ERROR IN GETALLQUIZZES", error)
        return responseHandler(500, { message: error.message})
    }
    
}

//working here
const addQuestion = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const body = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        const {quizname, question, answer, location} = body
        console.log("VALUES", quizname, question, answer, location)

        const placeholder = {
            question: question,
            answer: answer,
            location: location
        }

        const quiz = await addQuestionToQuiz(quizname, placeholder)
        if(!quiz){
            return responseHandler(500, {message: "Couldn't add question to quiz"})
        }

        return responseHandler(200, {message: "All goodie!"}

        )
    } catch (error) {
        return responseHandler(500, {message: error.message})
    }

}


export const addQuizAuth = middy(addQuiz).use(validateToken)
export const addQuestionAuth = middy(addQuestion).use(validateToken)
export const allQuizAuth = middy(getAllQuizzes).use(validateToken)