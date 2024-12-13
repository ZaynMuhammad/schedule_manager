export type UserId = string;

export interface User {
    email: string;
    username: string;
    password: string;  
    timezone?: string;
  }