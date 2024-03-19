type AnswerPicture = {
  _id: string;
  name: string;
  fileName: string;
  owner: string;
  created: string;
  edited: string;
};

type AnswerPictureUrls = { [fileName: string]: string };

export type { AnswerPicture, AnswerPictureUrls };
