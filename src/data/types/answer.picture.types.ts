type AnswerPicture = {
  _id: string;
  name: string;
  fileName: string;
  owner: string;
  created: string;
  edited: string;
};

type AnswerPictureFile = { file?: File };

type CreateAnswerPictureValues = Partial<Pick<AnswerPicture, 'name'> & AnswerPictureFile>;

type UpdateAnswerPictureValues = Partial<Pick<AnswerPicture, 'name'> & AnswerPictureFile>;

type AnswerPictureUrls = { [fileName: string]: string };

export type {
  AnswerPicture,
  AnswerPictureFile,
  CreateAnswerPictureValues,
  UpdateAnswerPictureValues,
  AnswerPictureUrls
};
