import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { addScoreToTable, getAllAttemptsForQuiz } from "../Services/Scoreboard/scoreboardService";
import { responseHandler } from "../Services/ResponseHandler/responseHandler";
import middy from "@middy/core";
import { validateToken } from "../Services/Auth/auth";

const addScore = async (event: APIGatewayProxyEvent, context: any): Promise<APIGatewayProxyResult> => {
    try {
    const body =
      typeof event.body === "string" ? JSON.parse(event.body) : event.body;
    const { quizname, score } = body;
    const userName = context.userName;

    const addScore = await addScoreToTable(quizname, userName, score);

    if("success" in addScore){
        if(!addScore.success){
            return responseHandler(400, {message: "Failed to add score"})
        }
    }

    return responseHandler(200, {message: "Score added"})


    } catch (error) {
        console.error("ERRORINROUTE", error);
        return responseHandler(500, {message: "Failed in Route"})
    }
}


const getSpecificQuizFromScoreboard = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {

    const quizname = event.pathParameters?.quiz;
    console.log("QUIZNAME", quizname);
    const quiz = await getAllAttemptsForQuiz(quizname!);

    if ("success" in quiz) {
      if (!quiz.success) {
        return responseHandler(400, { message: "Failed to add score" });
      }
    }

    if ("data" in quiz) {
      return responseHandler(200, { message: "Scores", data: quiz.data });
    } else {
      return responseHandler(404, { message: "No data in quiz" });
    }

  } catch (error) {
    console.error("ERROR IN ONE QUIZ ROUTE", error);
    return responseHandler(500, { message: "Fail in route"})
  }
};

export const addScoreAuth = middy(addScore).use(validateToken)
export const checkScoreAuth = middy(getSpecificQuizFromScoreboard).use(validateToken)
