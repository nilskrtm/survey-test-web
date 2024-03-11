import { Question } from './question.types';

type Survey = {
  _id: string;
  name: string;
  description: string;
  greeting: string;
  startDate: string;
  endDate: string;
  owner: string;
  created: string;
  edited: string;
  draft: boolean;
  archived: boolean;
  questions: Question[];
};

type CreateSurveyValues = Partial<Pick<Survey, 'description' | 'greeting' | 'name'>>;

type FinalizeSurveyValues = Partial<Pick<Survey, 'draft'>>;

type UpdateSurveyValues =
  | FinalizeSurveyValues
  | Partial<Pick<Survey, 'description' | 'endDate' | 'greeting' | 'name' | 'startDate'>>;

export type { Survey, CreateSurveyValues, UpdateSurveyValues };
