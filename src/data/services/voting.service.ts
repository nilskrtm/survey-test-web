import API from '../api';
import { AbsoluteVotings, DaySpanVotings } from '../types/voting.types';

const getVotingCount = (surveyId: string) => {
  return API.get<{ count: number }>('/surveys/' + surveyId + '/votings/count');
};

const getVotingsAbsoluteOfSurvey = (surveyId: string) => {
  return API.get<{ questions: AbsoluteVotings }>('/surveys/' + surveyId + '/votings/absolute');
};

const getVotingsDaySpanOfSurvey = (
  surveyId: string,
  timezone: string,
  startDate: string,
  endDate: string
) => {
  return API.get<{ questions: DaySpanVotings }>(
    '/surveys/' +
      surveyId +
      '/votings/day-span?timezone=' +
      timezone +
      '&startDate=' +
      startDate +
      '&endDate=' +
      endDate
  );
};

export default { getVotingCount, getVotingsAbsoluteOfSurvey, getVotingsDaySpanOfSurvey };
