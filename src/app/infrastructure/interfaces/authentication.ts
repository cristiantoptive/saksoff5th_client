export interface SigninCommand {
  email: string;
  password: string;
}

export interface AuthTokenViewModel {
  token: string;
  refreshToken: string;
}

