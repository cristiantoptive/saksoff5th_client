// eslint-disable-next-line no-shadow
export enum Roles {
  Admin = "admin",
  Guest = "guest",
  Customer = "customer",
  Merchandiser = "merchandiser",
}

export interface UserViewModel {
  id: string;
  email: string;
  role: Roles;
  firstName: string;
  lastName: string;
}

export interface UserExcerptViewModel {
  id: string;
  fullName: string;
}

export interface UserCommand {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: Roles;
}
