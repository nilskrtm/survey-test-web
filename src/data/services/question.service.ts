import API from '../api';
import {
  CreateQuestionValues,
  Question,
  QuestionOrdering,
  UpdateQuestionValues
} from '../types/question.types';

const getQuestions = (surveyId: string) => {
  return API.get<{ questions: Question[] }>('/surveys/' + surveyId + '/questions');
};

const getQuestion = (surveyId: string, questionId: string) => {
  return API.get<{ question: Question }>('/surveys/' + surveyId + '/questions/' + questionId);
};

const createQuestion = (surveyId: string, initialValues?: CreateQuestionValues) => {
  return API.post<{ id: string }, typeof initialValues>(
    '/surveys/' + surveyId + '/questions',
    initialValues
  );
};

const updateQuestion = (surveyId: string, questionId: string, values: UpdateQuestionValues) => {
  return API.patch<undefined, typeof values>(
    '/surveys/' + surveyId + '/questions/' + questionId,
    values
  );
};

const removeQuestion = (surveyId: string, questionId: string) => {
  return API.delete<undefined>('/surveys/' + surveyId + '/questions/' + questionId);
};

const reorderQuestions = (surveyId: string, ordering: QuestionOrdering) => {
  return API.patch<undefined, { ordering: typeof ordering }>(
    '/surveys/' + surveyId + '/questions/reorder',
    { ordering: ordering }
  );
};

export default {
  getQuestions,
  getQuestion,
  createQuestion,
  updateQuestion,
  removeQuestion,
  reorderQuestions
};
