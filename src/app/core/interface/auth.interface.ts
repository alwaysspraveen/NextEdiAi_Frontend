import { User } from './user.interface';

export interface Auth {
  requirePasswordChange: any;
  id?: string;
  token: string;
  user: User;
  name: string;
  email: string;
  password: string;
  idToken?: string;
}
export interface ChangePasswordPayload {
  userId: string;
  oldPassword?: string;
  currentPassword: string;
  newPassword: string;
}
