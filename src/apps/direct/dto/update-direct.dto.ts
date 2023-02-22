import { PartialType } from '@nestjs/mapped-types';
import { SendMessageDto } from './send-message.dto';

export class UpdateDirectDto extends PartialType(SendMessageDto) {}
