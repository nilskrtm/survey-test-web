import { CreateSurveyValues, Survey, UpdateSurveyValues } from '../types/survey.types';
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

const createSurvey = (initialValues?: CreateSurveyValues) => {
  return API.post<{ id: string }, typeof initialValues>(
    '/surveys',
    initialValues ? initialValues : {}
  );
};

const updateSurvey = (id: string, values: UpdateSurveyValues) => {
  return API.patch<{ surveyId: string }, typeof values>('/surveys/' + id, values);
};

export default { getSurveys, getSurvey, createSurvey, updateSurvey };
