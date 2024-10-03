import {
  GetCommand,
  PutCommand,
  UpdateCommand,
  QueryCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { docClient } from "../../db";
import { responseHandler } from "../ResponseHandler/responseHandler";
import { questionType } from "../../Types/types";

export const addQuizToTable = async (quizname: string, creator: string) => {
  try {
    const command = new PutCommand({
      TableName: process.env.QUIZ_TABLE,
      Item: {
        quizName: quizname,
        creator: creator,
        questions: [],
        quizStatus: "active",
      },
    });

    const quizAddResponse = await docClient.send(command);
    console.log("quizAddResponse", quizAddResponse);

    return { success: true };
  } catch (error) {
    console.error("ERROR IN ADDQUIZ", error);
    return responseHandler(500, { message: "Internal server error" });
  }
};

export const getAllQuizzesFromTable = async () => {
  try {
    const command = new QueryCommand({
      TableName: process.env.QUIZ_TABLE,
      IndexName: "StatusIndex",
      KeyConditionExpression: "quizStatus = :quizStatus",
      ExpressionAttributeValues: {
        ":quizStatus": "active",
      },
    });

    const allActiveQuizes = await docClient.send(command);
    console.log("ALLACTIVE", allActiveQuizes);
    const activeQuizes = allActiveQuizes.Items;

    return activeQuizes;
  } catch (error) {
    console.error("ERROR IN GETALL SERVICE", error);
    return responseHandler(500, { message: error.message });
  }
};

export const getQuiz = async (quizname: string) => {
  try {
    const command = new GetCommand({
      TableName: process.env.QUIZ_TABLE,
      Key: {
        quizName: quizname,
      },
    });

    const returnedQuizResponse = await docClient.send(command);
    console.log("RETURNEDQUIZ", returnedQuizResponse);

    return { success: true, quizData: returnedQuizResponse.Item };
  } catch (error) {
    console.error("ERROR IN GETQUIZ", error);
    return responseHandler(500, { message: error.message });
  }
};

export const addQuestionToQuiz = async (
  quizname: string,
  question: questionType
) => {
  try {

    const command = new UpdateCommand({
      TableName: process.env.QUIZ_TABLE,
      Key: {
        quizName: quizname,
      },
      UpdateExpression:
      "set questions = list_append(questions, :questions)",
      ExpressionAttributeValues: {
        ":questions": [question]
      },
      ReturnValues: "ALL_NEW",
    });

    const updateQuizResponse = await docClient.send(command);
    console.log("UPDATERESPONSE", updateQuizResponse.Attributes);
    return { success: true, message: "Quiz updated!" };
  } catch (error) {
    console.log("ERROR IN UPDATEQUIZ", error);
    return responseHandler(500, { message: error.message });
  }
};


export const deleteQuiz = async (quizname) => {
  try {
    const command = new DeleteCommand({
      TableName: process.env.QUIZ_TABLE,
      Key: {
        quizName: quizname
      }
    })

    const deleteResponse = await docClient.send(command);
    console.log("DELETERESPONSE", deleteResponse)
    return { success: true, message: "Quiz Deleted" };
  } catch (error) {
    responseHandler(500, { message: error.message})
    
  }
}
