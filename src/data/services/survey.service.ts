import { Survey } from '../types/survey.types';
import { APIPaging } from '../types/common.types';
import API from '../api';

const getSurveys = (page: number, perPage: number) => {
  return API.get<{ surveys: Array<Survey>; paging: APIPaging }>(
    '/surveys?page=' + page + '&perPage=' + perPage
  );
};

const getSurvey = (id: string) => {
  return API.get<Survey>('/surveys/' + id);
};

const createSurvey = (name: string) => {
  return API.post<Survey, { name: string }>('/surveys', { name: name });
};

export default { getSurveys, getSurvey, createSurvey };
