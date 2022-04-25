export interface UserViewModel {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface UserExcerptViewModel {
  id: string;
  fullName: string;
}

export interface ChangePasswordCommand {
  oldPassword: string;
  newPassword: string;
}
