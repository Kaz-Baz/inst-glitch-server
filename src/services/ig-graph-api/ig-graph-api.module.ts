import { IgGraphApiService } from './ig-graph-api.service';
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import config from '../config/config.module';
@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: () => ({
        baseURL: config.IG_URL,
        validateStatus: (status) => status >= 200 && status < 300,
      }),
    }),
  ],
  controllers: [],
  providers: [IgGraphApiService],
  exports: [IgGraphApiService],
})
export class IgGraphApiModule {}
