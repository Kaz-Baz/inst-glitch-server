import { FirestoreService } from './../../services/firebase/firestore.service';
import { FirestoreRepository } from 'src/services/firebase/firestore.repository';
import { Account } from './entities/account.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AccountsRepository extends FirestoreRepository<Account> {
  constructor(firestore: FirestoreService) {
    super('accounts', firestore);
  }
}
