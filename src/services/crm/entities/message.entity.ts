export type MessageContentType = 'image' | 'video';

export interface MessageContent {
  url: string;
  type: MessageContentType;
}

export class Message {
  date: number;
  senderId: number;
  text: string;
  content?: MessageContent;
}
