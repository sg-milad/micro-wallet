import { Body, Controller, Get, Inject, OnModuleInit, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { ClientKafka, EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserAmountDto } from '../../../../wallet/src/dto/update-user-amount.dto';

@ApiTags('User')
@Controller("user")
export class UserController implements OnModuleInit {
    constructor(
        private readonly userService: UserService,
        @Inject('Wallet-Service') private readonly client: ClientKafka
    ) { }

    @Post()
    @ApiOperation({
        description: 'Create user'
    })
    async createUser(@Body() createUserDto: CreateUserDto) {
        return await this.userService.createUser(createUserDto);
    }

    @Get(":id")
    @ApiOperation({
        description: 'Get user info'
    })
    async getUserInfo(@Param("id", new ParseUUIDPipe({ version: "4" })) id: string) {
        return await this.userService.getUserInfo(id);
    }

    @Patch(":id")
    @ApiOperation({
        description: 'Update user info'
    })
    async updateUser(@Param("id", new ParseUUIDPipe({ version: "4" })) id: string, @Body() updateUserDto: UpdateUserDto) {

        return await this.userService.updateUser(id, updateUserDto);
    }

    // @Patch(":id/amount")
    // @ApiOperation({
    //     description: 'Update user amount'
    // })
    // async updateUserInfo(@Param("id", new ParseUUIDPipe({ version: "4" })) id: string, @Body() updateUserAmountDto: UpdateUserAmountDto) {
    //     return await this.userService.updateUserAmount(id, updateUserAmountDto);
    // }

    // @Get(":id/amount")
    // @ApiOperation({
    //     description: 'Get user amount'
    // })
    // async getUserAmount(@Param("id", new ParseUUIDPipe({ version: "4" })) id: string) {
    //     return await this.userService.getUserAmount(id);
    // }

    @MessagePattern('get-user-amount')
    async handleGetUserAmount(@Payload() data: any) {
        console.log("get-user-amountttt", data);

        this.userService.getUserAmount(data);
    }


    async onModuleInit() {
        this.client.subscribeToResponseOf('get-user');
        this.client.subscribeToResponseOf('get-user-amount');
    }
}
