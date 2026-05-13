export interface UserType {
  userName: string;
  password: string;
}

export interface NewUserType {
  userName: string;
  password: string;
  fullName: string;
}

export interface User {
  _id: string;
  userName: string;
  password: string;
  fullName: string;
}

export interface SelectedUser {
  _id: string;
  userName: string;
  fullName: string;
}
