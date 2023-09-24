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
  @EventPattern('user-updated')
  async handleUserUpdated(data: any) {
    console.log("data", data);
    this.walletService.handelUpdateUser(data);
  }

  @EventPattern('user-amount-updated')
  async handleUserAmountUpdated(data: any) {
    this.walletService.handelUpdateUserAmount(data);
  }

  @MessagePattern('get-user-amount')
  async handleGetUserAmount(@Payload() data: any) {
    return this.walletService.getUserAmount(data);
  }
}
