import API from '../api';
import { AbsoluteVotingsResponse, DaySpanVotingsResponse } from '../types/voting.types';

const getVotingCount = (surveyId: string) => {
  return API.get<{ count: number }>('/surveys/' + surveyId + '/votings/count');
};

const getVotingsAbsoluteOfSurvey = (surveyId: string) => {
  return API.get<AbsoluteVotingsResponse>('/surveys/' + surveyId + '/votings/absolute');
};

const getVotingsDaySpanOfSurvey = (
  surveyId: string,
  timezone: string,
  startDate: string,
  endDate: string
) => {
  return API.get<DaySpanVotingsResponse>('/surveys/' + surveyId + '/votings/day-span', {
    params: { timezone: timezone, startDate: startDate, endDate: endDate }
  });
};

export default { getVotingCount, getVotingsAbsoluteOfSurvey, getVotingsDaySpanOfSurvey };
