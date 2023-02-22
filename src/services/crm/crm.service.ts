import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { IResult } from 'src/interfaces/result';
import { CreateChatDto } from './dto/create-chat.dto';
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class CrmService {
  constructor(private http: HttpService) {}

  private handleError(error: any) {
    if (error.response) {
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else {
      console.log('Error', error.message);
    }
    console.log(error.config);
    return false;
  }

  async createChat(dto: CreateChatDto) {
    return new Promise<IResult<any>>(async (resolve) => {
      this.http.axiosRef
        .post('/ig/chats', JSON.stringify(dto), {
          headers: { 'Content-Type': 'application/json' },
        })
        .then((response) =>
          resolve({
            data: response.data,
            isSuccess: true,
            code: response.status,
          }),
        )
        .catch((error) => {
          return resolve({
            data: error.data,
            isSuccess: false,
            code: error.status ?? error.response?.status ?? 400,
          });
        });
    });
  }

  async sendMessage(token: string, chatId: string, dto: SendMessageDto) {
    console.log(token, chatId, dto);
    return new Promise<IResult<any>>(async (resolve) => {
      return this.http.axiosRef
        .post(`/ig/accounts/${token}/chats/${chatId}`, JSON.stringify(dto), {
          params: { isIncoming: true },
          headers: { 'Content-Type': 'application/json' },
        })
        .then((response) =>
          resolve({
            data: response.data,
            isSuccess: true,
            code: response.status,
          }),
        )
        .catch((error) => {
          return resolve({
            data: error.data,
            isSuccess: false,
            code: error.status ?? error.response?.status ?? 400,
          });
        });
    });
  }
}
