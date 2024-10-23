import { User } from '../../data/types/user.types';
import { PermissionLevel } from '../enums/permissionlevel.enum';

export const dummyUser: () => User = () => {
  return {
    _id: 'dummy',
    username: '',
    email: '',
    firstname: '',
    lastname: '',
    permissionLevel: PermissionLevel.USER
  };
};
