import { User } from "./user";

export interface SigninResponse {
  token: string;
  user: User
}