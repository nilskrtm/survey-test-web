type User = {
  _id: string;
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  permissionLevel: number;
};

type CreateUserValues = Pick<User, 'username' | 'email' | 'firstname' | 'lastname'> & {
  password: string;
} & Partial<Pick<User, 'permissionLevel'>>;

type UpdateUserValues = Partial<
  Pick<User, 'email' | 'firstname' | 'lastname' | 'permissionLevel'> & { password: string }
>;

export type { User, CreateUserValues, UpdateUserValues };
