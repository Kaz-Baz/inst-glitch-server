/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Get, Post } from '@nestjs/common';
import { Body, Query } from '@nestjs/common/decorators';
import { ApiTags } from '@nestjs/swagger';
import { IgWebhookService } from './ig-webhook.service';
import { Webhook } from './webhook.entity';

@ApiTags('Webhook')
@Controller('webhook')
export class WebhookController {
  constructor(private webhookService: IgWebhookService) {}

  @Get()
  verifyWebhook(@Query() query: any) {
    console.log(query);
    return this.webhookService.verifyWebhook(
      query['hub.mode'],
      query['hub.verify_token'],
      query['hub.challenge'],
    );
  }

  @Post()
  handleWebhook(@Body() hook: Webhook) {
    console.log(hook);
    return this.webhookService.handleWebhook(hook);
  }
}
