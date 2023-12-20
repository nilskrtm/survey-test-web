import { Survey } from '../types/survey.types';
import { Paging } from '../types/common.types';
import API from '../api';

const getSurveys = () => {
  return API.get<{ surveys: Array<Survey>; paging: Paging }>('/surveys');
};

const getSurvey = (id: string) => {
  return API.get<Survey>('/surveys/' + id);
};

const createSurvey = (name: string) => {
  return API.post<Survey, { name: string }>('/surveys', { name: name });
};

export default { getSurveys, getSurvey, createSurvey };
