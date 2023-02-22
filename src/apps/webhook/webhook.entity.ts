export const webhookTypes = ['instagram'] as const;
export type WebhookType = typeof webhookTypes[number];

export interface Message {
  mid: string;
  text: string;
  is_echo?: boolean;
}

export interface Messaging {
  sender: { id: string };
  recipient: { id: string };
  message: Message;
}

export interface IgMessageEvent {
  time: number;
  id: string;
  messaging: Messaging[];
}

export interface IgUser {
  name: string;
  igsid: number;
}

export class Webhook {
  object: WebhookType;
  entry: IgMessageEvent[];
}
