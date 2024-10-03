import { GetCommand, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { docClient } from "../../db";
import { responseHandler } from "../ResponseHandler/responseHandler";

export const addScoreToTable = async (
  quizname: string,
  username: string,
  score: Number
) => {
  try {

    const command = new PutCommand({
      TableName: process.env.SCORE_TABLE,
      Item: {
        quizName: quizname,
        quizChallanger: username,
        score: score,
      },
    });

    const scoreResponse = await docClient.send(command);
    console.log("SCORERESPONSE", scoreResponse);
    return { success: true};

  } catch (error) {

    console.error("ERROR IN SOCRE SERVICE", error);
    return responseHandler(500, { message: error.message });
  }
};

export const getAllAttemptsForQuiz = async (quizname: string) => {
    try {
      const command = new QueryCommand({
        TableName: process.env.SCORE_TABLE,
        KeyConditionExpression: 'quizName = :quizName',
        ExpressionAttributeValues: {
          ':quizName': quizname,
        },
      });
  
      const quizAttemptsResponse = await docClient.send(command);
      console.log("QUIZ ATTEMPTS RESPONSE", quizAttemptsResponse);
      return { success: true, data: quizAttemptsResponse.Items };
  
    } catch (error) {
      console.error("ERROR IN GET ALL ATTEMPTS FOR QUIZ", error);
      return responseHandler(500, { message: error.message });
    }
  };
