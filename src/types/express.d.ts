import { Express, Request } from 'express';
//extend the Request interface from express to include a user property
declare module 'express' {
  interface Request {
    user: {
      id: string;
      email: string;
    };
  }
}
