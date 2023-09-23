import { Controller, Get } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class WalletController {
  constructor(private readonly walletService: WalletService) { }

  @EventPattern('user-created')
  async handleUserCreated(data: any) {
    this.walletService.handelCreateUser(data);
  }

  @MessagePattern('get-user')
  async handleGetUser(@Payload() data: any) {
    return this.walletService.getUserInfo(data);
  }
}
