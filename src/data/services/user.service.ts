import API from '../api';
import { User } from '../types/user.types';
import { CreateUserValues, UpdateUserValues } from '../types/user.types';
import { APIPaging } from '../types/common.types';

const getUsers = (
  page: number,
  perPage: number,
  filter?: { [key: string]: string | number | boolean }
) => {
  return API.get<{ users: Array<User>; paging: APIPaging }>('/users', {
    params: { page: page, perPage: perPage, ...filter }
  });
};

const getUser = (id: string) => {
  return API.get<{ user: User }>('/users/' + id);
};

const createUser = (initialValues: CreateUserValues) => {
  return API.post<{ id: string }, typeof initialValues>('/users', initialValues);
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

export default { getUsers, getUser, createUser, updateUser, getAccessKey, generateAccessKey };
