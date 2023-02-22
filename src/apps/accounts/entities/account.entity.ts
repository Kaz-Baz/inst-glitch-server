import { ApiProperty } from '@nestjs/swagger';

export class Account {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  token: string;
}
