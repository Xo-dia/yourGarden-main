export interface SigninResponse {
  token: string;
  user: {
    id: number;
    name: string;
    first_name: string;
    email: string;
    password: string;
  };
}