import { Request, Response } from 'express';
import * as bodyParser from 'body-parser';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { createHmac } from 'crypto';
import config from '../services/config/config.module';

@Injectable()
export class JsonBodyMiddleware implements NestMiddleware {
  static verifySignature(req: Request, res: Response, buf: Buffer) {
    const signature = req.headers['x-hub-signature'] as string;
    if (!signature) {
      console.warn(`Couldn't find "x-hub-signature" in headers.`);
    } else {
      const elements = signature.split('=');
      const signatureHash = elements[1];
      const expectedHash = createHmac('sha1', config.APP_SECRET)
        .update(buf)
        .digest('hex');
      if (signatureHash != expectedHash) {
        throw new Error(
          "Couldn't validate the request signature. Confirm your App Secret.",
        );
      }
    }
  }
  use(req: Request, res: Response, next: () => any) {
    bodyParser.json({ verify: JsonBodyMiddleware.verifySignature })(
      req,
      res,
      next,
    );
  }
}
