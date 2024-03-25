import { User } from '../data/types/user.types';

export const dummyUser: () => User = () => {
  return { _id: 'dummy', username: '', email: '', firstname: '', lastname: '', permissionLevel: 0 };
};
