import { AnswerPicture } from './answer.picture.types';

type AnswerOption = { _id: string; order: number; color: string; picture: AnswerPicture };

type CreateAnswerOptionValues = Partial<Pick<AnswerOption, 'color' | 'picture'>>;

type UpdateAnswerOptionValues = Partial<Pick<AnswerOption, 'color' | 'picture'>>;

type AnswerOptionOrdering = { [answerOptionsId: string]: number };

export type {
  AnswerOption,
  CreateAnswerOptionValues,
  UpdateAnswerOptionValues,
  AnswerOptionOrdering
};
