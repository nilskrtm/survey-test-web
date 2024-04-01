import API from '../api';
import {
  AnswerPicture,
  CreateAnswerPictureValues,
  UpdateAnswerPictureValues
} from '../types/answer.picture.types';
import { APIPaging } from '../types/common.types';
import { AnswerPictureUrls } from '../types/answer.picture.types';

const getAnswerPictures = (page: number, perPage: number, filter?: { [key: string]: string }) => {
  return API.get<{ answerPictures: Array<AnswerPicture>; paging: APIPaging }>('/answer-pictures', {
    params: { page: page, perPage: perPage, ...filter }
  });
};

const getAnswerPicture = (id: string) => {
  return API.get<{ answerPicture: AnswerPicture }>('/answer-pictures/' + id);
};

const createAnswerPicture = (initialValues: CreateAnswerPictureValues) => {
  if ('file' in initialValues) {
    const formData = new FormData();

    for (const key in initialValues) {
      const value = initialValues[key as keyof CreateAnswerPictureValues];

      if (value) {
        formData.append(key, value);
      }
    }

    return API.post<{ id: string }, FormData>('/answer-pictures', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }

  return API.post<{ id: string }, typeof initialValues>('/answer-pictures', initialValues);
};

const updateAnswerPicture = (id: string, values: UpdateAnswerPictureValues) => {
  if ('file' in values) {
    const formData = new FormData();

    for (const key in values) {
      const value = values[key as keyof UpdateAnswerPictureValues];

      if (value) {
        formData.append(key, value);
      }
    }

    return API.patch<{ id: string }, FormData>('/answer-pictures/' + id, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }

  return API.patch<undefined, typeof values>('/answer-pictures/' + id, values);
};

const removeAnswerPicture = (answerPictureId: string) => {
  return API.delete<undefined>('/answer-pictures/' + answerPictureId);
};

const getAnswerPictureUrls = (fileNames: string | Array<string>) => {
  const finalFileNames: Array<string> = Array.isArray(fileNames)
    ? fileNames
    : [fileNames as string];
  const queryFileNames = finalFileNames.join('&fileNames=');

  return API.get<{ urls: AnswerPictureUrls }>('/answer-pictures/urls?fileNames=' + queryFileNames);
};

const getAnswerPictureStatus = (id: string) => {
  return API.get<{ used: boolean }>('/answer-pictures/' + id + '/status');
};

export default {
  getAnswerPictures,
  getAnswerPicture,
  createAnswerPicture,
  updateAnswerPicture,
  removeAnswerPicture,
  getAnswerPictureUrls,
  getAnswerPictureStatus
};
