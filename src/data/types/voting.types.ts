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

type AbsoluteVotings = { questionId: string; answerOptionId: string; votes: number };

type AbsoluteVotingsResponse = {
  votes: Array<AbsoluteVotings>;
};

type DayVotings = {
  date: string;
  questionId: string;
  answerOptionId: string;
  votes: number;
};

type DaySpanVotingsResponse = {
  votes: Array<DayVotings>;
  days: Array<string>;
};

export type {
  Voting,
  AbsoluteVotings,
  AbsoluteVotingsResponse,
  DayVotings,
  DaySpanVotingsResponse
};
