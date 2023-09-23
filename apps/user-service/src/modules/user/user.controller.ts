import { Body, Controller, Get, Inject, OnModuleInit, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { ClientKafka, EventPattern } from '@nestjs/microservices';

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
    async getUserInfo(@Param("id") id: string) {
        return await this.userService.getUserInfo(id);
    }

    async onModuleInit() {
        this.client.subscribeToResponseOf('get-user');
    }
}
