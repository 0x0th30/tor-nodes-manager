import { Request, Response } from 'express';
import { Middleware, APIResponse } from '@contracts/middleware';

class BanIpMiddleware implements Middleware {
  public action(request: Request, response: Response): Promise<APIResponse> {
    const  = {}
    if (!request.body.address) {

      response.status(400).json({ success: false, message: 'Missing "address" field in request!' });
    }
  }
}

export { BanIpMiddleware };
