import { AnswerOption } from './answer.option.types';

type Question = {
  _id: string;
  question: string;
  timeout: number;
  order: number;
  answerOptions: Array<AnswerOption>;
};

type CreateQuestionValues = Partial<Pick<Question, 'question' | 'timeout'>>;

type UpdateQuestionValues = Partial<Pick<Question, 'question' | 'timeout'>>;

type QuestionOrdering = { [questionId: string]: number };

export type { Question, CreateQuestionValues, UpdateQuestionValues, QuestionOrdering };
