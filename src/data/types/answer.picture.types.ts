type AnswerPicture = {
  _id: string;
  name: string;
  fileName: string;
  owner: string;
  created: string;
  edited: string;
};

type CreateAnswerPictureValues = Partial<Pick<AnswerPicture, 'name'>>;

type UpdateAnswerPictureValues = Partial<Pick<AnswerPicture, 'name'>>;

type AnswerPictureUrls = { [fileName: string]: string };

export type {
  AnswerPicture,
  CreateAnswerPictureValues,
  UpdateAnswerPictureValues,
  AnswerPictureUrls
};
