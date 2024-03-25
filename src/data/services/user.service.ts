import API from '../api';
import { User } from '../types/user.types';
import { UpdateUserValues } from '../types/user.types';

const getUser = (id: string) => {
  return API.get<{ user: User }>('/users/' + id);
};

const updateUser = (id: string, values: UpdateUserValues) => {
  return API.patch<undefined, typeof values>('/users/' + id, values);
};

const getAccessKey = () => {
  return API.get<{ accessKey: string }>('/access-key');
};

const generateAccessKey = () => {
  return API.get<{ accessKey: string }>('/access-key/generate');
};

export default { getUser, updateUser, getAccessKey, generateAccessKey };
