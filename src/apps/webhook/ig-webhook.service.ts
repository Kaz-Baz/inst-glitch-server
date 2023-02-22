import { IgGraphApiService } from './../../services/ig-graph-api/ig-graph-api.service';
import { CrmService } from './../../services/crm/crm.service';
import { Injectable } from '@nestjs/common';
import {
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import config from '../../services/config/config.module';
import { AccountsService } from '../accounts/accounts.service';
import { Messaging, Webhook } from './webhook.entity';

@Injectable()
export class IgWebhookService {
  constructor(
    private accounts: AccountsService,
    private crm: CrmService,
    private ig: IgGraphApiService,
  ) {}
  verifyWebhook(mode: string, token: string, challenge: any) {
    console.log('Got /webhook');
    if (mode && token) {
      if (mode === 'subscribe' && token === config.VERIFY_TOKEN) {
        console.log('WEBHOOK_VERIFIED');
        return challenge;
      } else {
        throw new ForbiddenException();
      }
    } else {
      console.warn('Got /webhook but without needed parameters.');
    }
  }

  async handleMessage(accountId: string, messaging: Messaging) {
    const account = await this.accounts.findOne(accountId);
    if (!account) {
      console.warn('Handle message to account, that is not available');
      return;
    }

    let sendMessageResult = await this.crm.sendMessage(
      account.token,
      messaging.sender.id,
      {
        text: messaging.message.text,
      },
    );
    console.log({ sendMessageResult });
    if (!sendMessageResult.isSuccess) {
      if (sendMessageResult.code !== 404) {
        console.log('Crm sendMessage failed', sendMessageResult);
        return;
      }
      const getUserResult = await this.ig.getUser(
        account.token,
        messaging.sender.id,
      );
      console.log({ getUserResult });
      if (!getUserResult.isSuccess) {
        console.log(`Cannot get user by id ${messaging.sender.id}`);
        return;
      }
      console.log({ getUserResult });
      const createChatResult = await this.crm.createChat({
        name: getUserResult.data.name,
        username: getUserResult.data.name,
        id: +messaging.sender.id,
        accountId: account.id,
      });
      console.log({ createChatResult });
      if (!createChatResult.isSuccess) {
        console.log('Cannot create chat', createChatResult);
        return;
      }
      sendMessageResult = await this.crm.sendMessage(
        account.token,
        messaging.sender.id,
        {
          text: messaging.message.text,
        },
      );
      console.log(sendMessageResult);
      if (!sendMessageResult.isSuccess) {
        console.log('Retry send message failed', sendMessageResult);
      }
    }
  }

  async handleWebhook(hook: Webhook) {
    console.log(`\u{1F7EA} Received webhook:`);
    console.dir(hook);

    if (hook.object === 'instagram') {
      await Promise.all(
        hook.entry.map(async (entry) => {
          if (!('messaging' in entry)) {
            console.warn(
              'No messaging field in entry. Possibly a webhook test.',
            );
            return;
          }
          await Promise.all(
            entry.messaging.map(async (event) => {
              if (!('message' in event)) return;

              if (event.message.is_echo === true) {
                console.log('Got an echo');
                return;
              }

              if (event.message.text)
                return this.handleMessage(entry.id, event);
            }),
          );
        }),
      );
      return 'EVENT_RECEIVED';
    } else if (hook.object === 'page') {
      console.warn(
        `Received Messenger "page" object instead of "instagram" message webhook.`,
      );
      throw new NotFoundException();
    } else {
      console.warn(`Unrecognized POST to webhook.`);
      throw new NotFoundException();
    }
  }
}
