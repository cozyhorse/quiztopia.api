export type userObject = {
  userName: string;
  password: string;
};

export type questionType = {
  question: "string";
  answer: "string";
  location: {
    longitude: number;
    latitude: number;
  };
};
