import { IResult } from './../../interfaces/result';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { HttpsProxyAgent } from 'https-proxy-agent';
import config from '../config/config.module';

export interface UserInfo {
  id: string;
  name: string;
  instagram_business_account: { username: string };
}

@Injectable()
export class IgGraphApiService {
  constructor(private readonly http: HttpService) {
    const proxyUrl = config.PROXY_URL;
    console.log(proxyUrl);
    http.axiosRef.defaults.httpsAgent = new HttpsProxyAgent(proxyUrl);
    http.axiosRef.defaults.proxy = false;
  }

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

  async test() {
    const url = 'https://jsonplaceholder.typicode.com/albums';
    console.log(url);
    const res = await this.http.axiosRef.get(url).catch((err) => {
      console.log(err);
      return { data: err.mesage };
    });
    console.log(res.data);
    return res.data;
  }

  async sendMessage(id: number, token: string, text: string) {
    const body = {
      recipient: { id },
      message: { text },
    };
    console.log(body);
    return new Promise<IResult<any>>(async (resolve) => {
      return this.http.axiosRef
        .post(`/me/messages`, body, {
          params: {
            access_token: token,
          },
        })
        .then((response) =>
          resolve({
            data: response.data,
            isSuccess: true,
            code: response.status,
          }),
        )
        .catch((error) => {
          this.handleError(error);
          return resolve({
            data: error.data,
            isSuccess: false,
            code: error.status ?? error.response?.status ?? 400,
          });
        });
    });
  }

  async getUser(token: string, userIgId: string | number) {
    return new Promise<IResult<UserInfo>>(async (resolve) => {
      return this.http.axiosRef
        .get<UserInfo>(`/${userIgId}`, {
          params: {
            access_token: token,
            fields: 'name',
          },
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

  async getMe(token: string) {
    return new Promise<IResult<UserInfo>>(async (resolve) => {
      return this.http.axiosRef
        .get('/me', {
          params: {
            fields: 'id,name,instagram_business_account{username}',
            access_token: token,
          },
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

  async getChats(token: string) {
    return new Promise<IResult<any>>(async (resolve) => {
      return this.http.axiosRef
        .get(
          `/me/conversations?fields=messages{from,to,message,created_time,id}`,
          {
            params: { access_token: token, platform: 'instagram' },
          },
        )
        .then((response) =>
          resolve({
            data: response.data,
            isSuccess: true,
            code: response.status,
          }),
        )
        .catch((error) => {
          this.handleError(error);
          return resolve({
            data: error.data,
            isSuccess: false,
            code: error.status ?? error.response?.status ?? 400,
          });
        });
    });
  }
}
