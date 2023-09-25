import { Body, Controller, Get, Param, ParseUUIDPipe, Patch } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateUserAmountDto } from './dto/update-user-amount.dto';

@ApiTags('Wallet')
@Controller('user')
export class WalletController {
  constructor(private readonly walletService: WalletService) { }

  @EventPattern('user-created')
  async handleUserCreated(data: any) {
    this.walletService.handleCreateUser(data);
  }

  @MessagePattern('get-user')
  async handleGetUser(@Payload() data: any) {
    return this.walletService.getUserInfo(data);
  }
  @EventPattern('user-updated')
  async handleUserUpdated(data: any) {
    console.log("data", data);
    this.walletService.handleUpdateUser(data);
  }

  @Patch(":id/amount")
  @ApiOperation({
    description: 'Update user amount'
  })
  async updateUserAmount(
    @Param("id", new ParseUUIDPipe({ version: "4" })) id: string,
    @Body() updateUserAmountDto: UpdateUserAmountDto) {
    return await this.walletService.updateUserAmount(id, updateUserAmountDto);
  }

  @Get(":id/amount")
  @ApiOperation({
    description: 'Get user amount'
  })
  async getUserAmount(@Param("id", new ParseUUIDPipe({ version: "4" })) id: string) {
    return await this.walletService.getUserAmount(id);
  }
}
