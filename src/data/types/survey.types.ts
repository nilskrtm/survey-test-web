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

type UpdateSurveyValues = Partial<
  Pick<Survey, 'description' | 'endDate' | 'greeting' | 'name' | 'startDate'>
>;

type FinalizeSurveyValues = Partial<Pick<Survey, 'draft'>>;

export type { Survey, CreateSurveyValues, UpdateSurveyValues, FinalizeSurveyValues };
