import { CrmService } from './crm.service';
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import config from '../config/config.module';

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: () => ({
        baseURL: config.CRM_URL,
        validateStatus: (status) => status >= 200 && status < 300,
      }),
    }),
  ],
  controllers: [],
  providers: [CrmService],
  exports: [CrmService],
})
export class CrmModule {}
