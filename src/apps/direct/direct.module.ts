import { IgGraphApiModule } from './../../services/ig-graph-api/ig-graph-api.module';
import { Module } from '@nestjs/common';
import { DirectService } from './direct.service';
import { DirectController } from './direct.controller';

@Module({
  imports: [IgGraphApiModule],
  controllers: [DirectController],
  providers: [DirectService],
})
export class DirectModule {}
