---Tables

  UsersTable: 
    userName: "string" type Hash (primary key)
    password: "string" //bcrypt


  QuizTable:
    quizName: type Hash (primary key)
    creator: "string" GSI
    questions: [
      {
        questionId: "string",
        question: "string",
        answer: "string",
        location: {
          longitude: number,
          latitude: number
        }
      },
      {
        questionId: "string",
        question: "string",
        answer: "string",
        location: {
          longitude: number,
          latitude: number
        }
      },   
    ]

    ScoreTable:
      quizname: "string",
      quizChallanger: "string", GSI
      score: "number"


      {
        quizName: Horses,
        quizChallanger: Horseman, -- from token
        score: 5
      }


    UserTable:
      Type: AWS::DynamoDB::Table
      Properties:
        TableName: ${self:custom.tables.UserTable}
        AttributeDefinitions:
          - AttributeName: userName
            AttributeType: S
        KeySchema:
          - AttributeName: userName
            KeyType: HASH
        BillingMode: PAY_PER_REQUEST

    QuizTable:
      Type: AWS::DynamoDB::Table
      Properties:
        TableName: ${self:custom.tables.QuizTable}
        AttributeDefinitions:
          - AttributeName: quizName
            AttributeType: S
          - AttributeName: creator
            AttributeType: S
          - AttributeName: quizStatus
            AttributeType: S
        KeySchema:
          - AttributeName: quizName
            KeyType: HASH
        GlobalSecondaryIndexes:
          - IndexName: CreatorIndex
            KeySchema:
              - AttributeName: creator
                KeyType: HASH
            Projection:
              ProjectionType: ALL

          - IndexName: StatusIndex
            KeySchema:
              - AttributeName: quizStatus
                KeyType: HASH
            Projection:
              ProjectionType: ALL
        BillingMode: PAY_PER_REQUEST

    ScoreTable:
      Type: AWS::DynamoDB::Table
      Properties:
        TableName: ${self:custom.tables.ScoreTable}
        AttributeDefinitions:
          - AttributeName: quizName
            AttributeType: S
          - AttributeName: quizChallanger
            AttributeType: S
        KeySchema:
          - AttributeName: quizName
            KeyType: HASH
          - AttributeName: quizChallanger
            KeyType: RANGE
        BillingMode: PAY_PER_REQUEST