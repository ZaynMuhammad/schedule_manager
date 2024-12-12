export type UserId = string;

export interface User {
    email: string;
    username: string;
    password: string;  // This should be pre-hashed before reaching this function
    timezone?: string;
  }