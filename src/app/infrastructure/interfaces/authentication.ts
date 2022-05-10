import { UserViewModel } from "./users";

export interface SigninCommand {
  email: string;
  password: string;
}

export interface SignupCommand {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface AuthTokenViewModel {
  token: string;
  user: UserViewModel;
}

