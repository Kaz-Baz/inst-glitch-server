import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import config from 'src/services/config/config.module';

@Injectable()
export class XForwardedProtoMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('XFORWARDEDPROTO');
    const reqProtocol = req.get('x-forwarded-proto')
      ? req.get('x-forwarded-proto').split(',')[0]
      : req.get('protocol');
    const reqAppUrl = reqProtocol + '://' + req.get('host');
    if (config.APP_URL != reqAppUrl) {
      config.APP_URL = reqAppUrl;
      console.log(`Updated appUrl to ${config.APP_URL}`);
    }
    next();
  }
}
