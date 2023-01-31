import { NextFunction, Request, Response } from 'express';

interface APIResponse {
  success: boolean,
  message?: string,
  data?: object,
}

interface Middleware {
  action(request: Request, response: Response, next?: NextFunction): Promise<APIResponse>,
}

export { Middleware, APIResponse };
