import { User } from '../../../data/types/user.types';

export type UserDataWSPayload = Pick<
  User,
  'username' | 'email' | 'firstname' | 'lastname' | 'permissionLevel'
>;
