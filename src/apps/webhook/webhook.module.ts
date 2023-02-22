import { CrmModule } from './../../services/crm/crm.module';
import { IgGraphApiModule } from '../../services/ig-graph-api/ig-graph-api.module';
import { WebhookController } from './webhook.controller';

import { MiddlewareConsumer, Module } from '@nestjs/common';
import { IgWebhookService } from './ig-webhook.service';
import { AccountsModule } from '../accounts/accounts.module';
import { XForwardedProtoMiddleware } from 'src/middlewares/x-forwarded-proto.middleware';

@Module({
  imports: [AccountsModule, IgGraphApiModule, CrmModule],
  controllers: [WebhookController],
  providers: [IgWebhookService],
})
export class WebhookModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(XForwardedProtoMiddleware).forRoutes('/webhook');
  }
}
