import API from '../api';

const getVotingCount = (surveyId: string) => {
  return API.get<{ count: number }>('/surveys/' + surveyId + '/votings/count');
};

export default { getVotingCount };
