import API from '../api';
import { AbsoluteSurveyVotings } from '../types/voting.types';

const getVotingCount = (surveyId: string) => {
  return API.get<{ count: number }>('/surveys/' + surveyId + '/votings/count');
};

const getVotingsAbsoluteOfSurvey = (surveyId: string) => {
  return API.get<{ questions: AbsoluteSurveyVotings }>(
    '/surveys/' + surveyId + '/votings/absolute'
  );
};

export default { getVotingCount, getVotingsAbsoluteOfSurvey };
