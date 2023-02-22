import { CrmModule } from './services/crm/crm.module';
import { IgWebhookService } from './apps/webhook/ig-webhook.service';
import { WebhookModule } from './apps/webhook/webhook.module';
import { DirectModule } from './apps/direct/direct.module';
import { IgGraphApiModule } from './services/ig-graph-api/ig-graph-api.module';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { JsonBodyMiddleware } from './middlewares/verify-request-signature.middleware';
import { LoggerMiddleware } from './middlewares/log.middleware';
import { XForwardedProtoMiddleware } from './middlewares/x-forwarded-proto.middleware';
import { AccountsModule } from './apps/accounts/accounts.module';
@Module({
  imports: [
    CrmModule,
    WebhookModule,
    IgGraphApiModule,
    DirectModule,
    AccountsModule,
  ],
  controllers: [],
  providers: [IgWebhookService],
})
export class AppModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*')
      .apply(JsonBodyMiddleware)
      .forRoutes('*');
  }
}
