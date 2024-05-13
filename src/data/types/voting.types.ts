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

type AbsoluteVotings = [
  {
    questionId: string;
    answerOptions: [
      {
        answerOptionId: string;
        count: number;
      }
    ];
  }
];

type DaySpanVotings = {
  [questionId: string]: {
    dates: {
      [date: string]: {
        votes: Array<{ answerOptionId: string; votes: number }>;
      };
    };
  };
};

export type { Voting, AbsoluteVotings, DaySpanVotings };
