import { FirestoreService } from './firestore.service';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  providers: [FirestoreService],
  exports: [FirestoreService],
})
export class FirestoreModule {}
