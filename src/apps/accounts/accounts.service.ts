import { IgGraphApiService } from './../../services/ig-graph-api/ig-graph-api.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { AccountsRepository } from './accounts.repository';
import { CreateAccountDto } from './dto/create-account.dto';
import { CrudService } from 'src/interfaces/crud.service';
import { Account } from './entities/account.entity';

@Injectable()
export class AccountsService extends CrudService<string, Account> {
  constructor(
    protected repository: AccountsRepository,
    private ig: IgGraphApiService,
  ) {
    super('Account', repository);
  }

  async create(dto: CreateAccountDto) {
    const userInfoResult = await this.ig.getMe(dto.token);
    if (!userInfoResult.isSuccess)
      throw new BadRequestException(
        userInfoResult.data ?? 'Ig account not found',
      );

    const account: Account = {
      ...dto,
      name: userInfoResult.data.name,
      username: userInfoResult.data.instagram_business_account.username,
      id: '17841456458231106',
    };
    return this.repository
      .set('17841456458231106', account)
      .then(() => account);
  }
}
