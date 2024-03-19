import API from '../api';
import { AnswerPictureUrls } from '../types/answer.picture.types';

const getAnswerPictureUrls = (fileNames: string | Array<string>) => {
  const finalFileNames: Array<string> = Array.isArray(fileNames)
    ? fileNames
    : [fileNames as string];
  const queryFileNames = finalFileNames.join('&fileNames=');

  return API.get<{ urls: AnswerPictureUrls }>('/answer-pictures/urls?fileNames=' + queryFileNames);
};

export default { getAnswerPictureUrls };
