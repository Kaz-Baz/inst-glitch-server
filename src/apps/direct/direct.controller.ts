import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DirectService } from './direct.service';
import { SendMessageDto } from './dto/send-message.dto';

@ApiTags('Direct')
@Controller('direct')
export class DirectController {
  constructor(private readonly directService: DirectService) {}

  @Get(':token')
  async testProxy(@Param('token') token: string) {
    return await this.directService.getChats(token);
  }

  @Post()
  async create(@Body() createDirectDto: SendMessageDto) {
    return await this.directService.sendMessage(createDirectDto);
  }

  @Get('test/connection')
  async test() {
    return this.directService.test();
  }
}
