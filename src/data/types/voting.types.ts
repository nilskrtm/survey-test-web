type Voting = {
  _id: string;
  survey: string;
  date: string;
  votes: Array<Vote>;
};

type Vote = {
  question: string;
  answerOption: string;
};

type AbsoluteSurveyVotings = [
  {
    questionId: string;
    answerOptions: [
      {
        answerOptionId: string;
        count: number;
      }
    ];
    count: number;
  }
];

export type { Voting, AbsoluteSurveyVotings };
