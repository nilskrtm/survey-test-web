import API from '../api';

const getAccessKey = () => {
  return API.get<{ accessKey: string }>('/access-key');
};

const generateAccessKey = () => {
  return API.post<{ accessKey: string }, undefined>('/access-key');
};

export default { getAccessKey, generateAccessKey };
