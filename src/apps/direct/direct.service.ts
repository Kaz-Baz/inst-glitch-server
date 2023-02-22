import { Injectable } from '@nestjs/common';
import { SendMessageDto } from './dto/send-message.dto';
import { IgGraphApiService } from '../../services/ig-graph-api/ig-graph-api.service';

@Injectable()
export class DirectService {
  constructor(private readonly graphApi: IgGraphApiService) {}
  async getChats(token: string) {
    return await this.graphApi.getChats(token);
  }
  async sendMessage(dto: SendMessageDto) {
    return await this.graphApi.sendMessage(
      dto.recipientId,
      dto.token,
      dto.text,
    );
  }

  async test() {
    return this.graphApi.test();
  }
}
