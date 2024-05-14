import API from '../api';
import {
  AbsoluteVotingsResponse,
  DaySpanVotingsResponse,
  HourSpanVotingsResponse
} from '../types/voting.types';

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

const getVotingsHourSpanOfSurvey = (
  surveyId: string,
  timezone: string,
  dayDate: string,
  startDate: string,
  endDate: string
) => {
  return API.get<HourSpanVotingsResponse>('/surveys/' + surveyId + '/votings/hour-span', {
    params: { timezone: timezone, dayDate: dayDate, startDate: startDate, endDate: endDate }
  });
};

export default {
  getVotingCount,
  getVotingsAbsoluteOfSurvey,
  getVotingsDaySpanOfSurvey,
  getVotingsHourSpanOfSurvey
};
