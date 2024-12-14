export type UserId = string;
export type Username = string;

export interface User {
    email: string;
    username: string;
    password: string;  
    timezone: string;
    workingHoursStart: string;
    workingHoursEnd: string;
  }
