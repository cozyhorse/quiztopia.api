---Tables

UsersTable: 
  userName: "string" type Hash (primary key)
  password: "string" //bcrypt


QuizTable:
  quizName: type Hash (primary key)
  creator: "string" GSI
  question: [
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
    quizChallanger: Horseman,
    score: 5
  }