import { Survey } from '../types/survey.types';
import { APIPaging } from '../types/common.types';
import API from '../api';

const getSurveys = (page: number, perPage: number, filter?: { [key: string]: string }) => {
  return API.get<{ surveys: Array<Survey>; paging: APIPaging }>('/surveys', {
    params: { page: page, perPage: perPage, ...filter }
  });
};

const getSurvey = (id: string) => {
  return API.get<{ survey: Survey }>('/surveys/' + id);
};

const createSurvey = (initialValues?: Partial<Survey>) => {
  return API.post<{ surveyId: string }, Partial<Survey>>(
    '/surveys',
    initialValues ? initialValues : {}
  );
};

const updateSurvey = (id: string, values: Partial<Survey>) => {
  return API.patch<{ surveyId: string }, Partial<Survey>>('/surveys/' + id, values);
};

export default { getSurveys, getSurvey, createSurvey, updateSurvey };
