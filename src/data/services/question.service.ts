import API from '../api';
import { QuestionOrdering } from '../types/question.types';

const reorderQuestions = (surveyId: string, ordering: QuestionOrdering) => {
  return API.patch<undefined, { ordering: typeof ordering }>(
    '/surveys/' + surveyId + '/questions/reorder',
    { ordering: ordering }
  );
};

export default { reorderQuestions };
