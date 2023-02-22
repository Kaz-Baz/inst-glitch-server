import { MessageContent } from '../entities/message.entity';

export class SendMessageDto {
  text: string;
  content?: MessageContent;
}
