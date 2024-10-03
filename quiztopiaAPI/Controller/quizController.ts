import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { addQuestionToQuiz, addQuizToTable, deleteQuiz, getAllQuizzesFromTable, getQuiz } from '../Services/Quiz/quizServices';
import { responseHandler } from '../Services/ResponseHandler/responseHandler';
import { validateToken } from '../Services/Auth/auth';
import middy from '@middy/core';
import { ajv } from '../db';
import { questionSchema, quizSchema } from '../Schema/quizSchema';

const addQuiz = async (event: APIGatewayProxyEvent, context: any): Promise<APIGatewayProxyResult> => {
    try {
        const body = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        const {quizname} = body;
        const userName = context.userName;
        const validate = ajv.compile(quizSchema);
        const isValid = validate(body);
        if(!isValid) {
            return responseHandler(400, {error: validate.errors});
        }
        

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
            return responseHandler(500, {message: "Failed to create quiz/Quizname might already exist"})
        }



    
} catch (error) {
    console.error("FAIL IN ADDQUIZ ROUTE", error)
    return responseHandler(500, {message: "Internal server error"})
}

}


export const getAllQuizzes = async () => {
    try {
        const quizzes = await getAllQuizzesFromTable()
        return responseHandler(200, { quizzes })
    } catch (error) {
        console.error("ERROR IN GETALLQUIZZES", error)
        return responseHandler(500, { message: error.message})
    }
    
}

export const getSpecificQuiz = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const quizname = event.pathParameters?.quizname
        if(!quizname){
            return responseHandler(400, {message: "missing quizname parameter"})
        }
        
        const quiz = await getQuiz(quizname)
        if(!quiz){
            return responseHandler(404, {message: "Quiz might not exist"})
        }

        if("quizData" in quiz){
            return responseHandler(200, {quiz: quiz.quizData})
        }else{
            return responseHandler(400, {message: "quizData is missing"})
        }

    } catch (error) {
        console.error("ERROR IN GETSPECIFIC ROUTE", error);
        return responseHandler(500, { message: error.message})
        
    }
}


const addQuestion = async (event: APIGatewayProxyEvent, context: any): Promise<APIGatewayProxyResult> => {
    try {
        const body = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        const {quizname, question, answer, location} = body
        const userName = context.userName
        const validate = ajv.compile(questionSchema);
        const isValid = validate(body);
        if(!isValid) {
            return responseHandler(400, {error: validate.errors});
        }

        const checkQuizOwner = await getQuiz(quizname)

        if(!checkQuizOwner){
            return responseHandler(404, {message: "Quiz might not exist"})
        }

        if("quizData" in checkQuizOwner && checkQuizOwner.quizData){
            if(checkQuizOwner.quizData.creator !== userName){
                return responseHandler(401, {message: "You are not the owner of this quiz"})
            }
        }else{
            return responseHandler(400, {message: "no quiz data found"})
        }

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


const quizDeletion = async (event: APIGatewayProxyEvent, context: any): Promise<APIGatewayProxyResult> => {
    try {
        const userName = context.userName;
        const quizname = event.pathParameters?.quizname
        if(!quizname){
            return responseHandler(400, {message: "missing quizname parameter"})
        }
        
        const checkQuizOwner = await getQuiz(quizname)

        if(!checkQuizOwner){
            return responseHandler(404, {message: "Quiz might not exist"})
        }

        if("quizData" in checkQuizOwner && checkQuizOwner.quizData){
            if(checkQuizOwner.quizData.creator !== userName){
                return responseHandler(401, {message: "You are not the owner of this quiz"})
            }else{
                const deletequiz = await deleteQuiz(quizname)
                return responseHandler(200, {message: "Quiz deleted!"})
            }
        }else{
            return responseHandler(400, {message: "no quiz data found"})
        }


    } catch (error) {
        return responseHandler(500, {message: error.message})
    }

}


export const addQuizAuth = middy(addQuiz).use(validateToken)
export const addQuestionAuth = middy(addQuestion).use(validateToken)
export const removeQuizAuth = middy(quizDeletion).use(validateToken)