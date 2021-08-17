import { Controller, Get, Post, Req, Request, UseGuards } from '@nestjs/common';

import { Message } from '@red-tetris/api-interfaces';

import { AppService } from './app.service';
import { AuthGuard } from "@nestjs/passport";

@Controller()
export class AppController {
  constructor (
    private readonly appService: AppService) {
  }

  @Get('hello')
  getData (): Message {
    return this.appService.getData();
  }

  @UseGuards(AuthGuard("local"))
  @Post('auth/login')
  async login (@Request() req) {
    return req.user;
  }

}
