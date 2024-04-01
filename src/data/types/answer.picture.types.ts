type AnswerPicture = {
  _id: string;
  name: string;
  fileName: string;
  owner: string;
  created: string;
  edited: string;
};

type AnswerPictureFile = { file?: File };

type CreateAnswerPictureValues = AnswerPictureFile & Partial<Pick<AnswerPicture, 'name'>>;

type UpdateAnswerPictureValues = AnswerPictureFile & Partial<Pick<AnswerPicture, 'name'>>;

type AnswerPictureUrls = { [fileName: string]: string };

export type {
  AnswerPicture,
  CreateAnswerPictureValues,
  UpdateAnswerPictureValues,
  AnswerPictureUrls
};
