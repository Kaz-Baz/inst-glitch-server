import { ApiProperty } from '@nestjs/swagger';

export class SendMessageDto {
  @ApiProperty()
  token: string;

  @ApiProperty()
  recipientId: number;

  @ApiProperty()
  text: string;
}
