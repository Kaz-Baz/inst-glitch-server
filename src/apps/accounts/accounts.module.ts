import { IgGraphApiModule } from './../../services/ig-graph-api/ig-graph-api.module';
import { FirestoreModule } from './../../services/firebase/firebase.module';
import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { AccountsRepository } from './accounts.repository';

@Module({
  imports: [FirestoreModule, IgGraphApiModule],
  controllers: [AccountsController],
  providers: [AccountsService, AccountsRepository],
  exports: [AccountsService],
})
export class AccountsModule {}
