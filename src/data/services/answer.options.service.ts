import API from '../api';
import {
  AnswerOption,
  AnswerOptionOrdering,
  CreateAnswerOptionValues,
  UpdateAnswerOptionValues
} from '../types/answer.option.types';

const getAnswerOptions = (surveyId: string, questionId: string) => {
  return API.get<{ answerOptions: AnswerOption[] }>(
    '/surveys/' + surveyId + '/questions/' + questionId + '/answer-options'
  );
};

const getAnswerOption = (surveyId: string, questionId: string, answerOptionId: string) => {
  return API.get<{ answerOption: AnswerOption }>(
    '/surveys/' + surveyId + '/questions/' + questionId + '/answer-options/' + answerOptionId
  );
};

const createAnswerOption = (
  surveyId: string,
  questionId: string,
  initialValues?: CreateAnswerOptionValues
) => {
  return API.post<{ id: string }, typeof initialValues>(
    '/surveys/' + surveyId + '/questions/' + questionId + '/answer-options',
    initialValues
  );
};

const updateAnswerOption = (
  surveyId: string,
  questionId: string,
  answerOptionId: string,
  values: UpdateAnswerOptionValues
) => {
  return API.patch<undefined, typeof values>(
    '/surveys/' + surveyId + '/questions/' + questionId + '/answer-options/' + answerOptionId,
    values
  );
};

const removeAnswerOption = (surveyId: string, questionId: string, answerOptionId: string) => {
  return API.delete<undefined>(
    '/surveys/' + surveyId + '/questions/' + questionId + '/answer-options/' + answerOptionId
  );
};

const reorderAnswerOptions = (
  surveyId: string,
  questionId: string,
  ordering: AnswerOptionOrdering
) => {
  return API.patch<undefined, { ordering: typeof ordering }>(
    '/surveys/' + surveyId + '/questions/' + questionId + '/answer-options/reorder',
    { ordering: ordering }
  );
};

export default {
  getAnswerOptions,
  getAnswerOption,
  createAnswerOption,
  updateAnswerOption,
  removeAnswerOption,
  reorderAnswerOptions
};
