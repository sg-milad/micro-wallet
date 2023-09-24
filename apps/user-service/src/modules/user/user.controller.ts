import { Body, Controller, Get, Inject, OnModuleInit, Param, Patch, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { ClientKafka, EventPattern } from '@nestjs/microservices';
import { UpdateUserDto } from './dto/update-user.dto';

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

    @Patch(":id")
    @ApiOperation({
        description: 'Update user info'
    })
    async updateUser(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
        return await this.userService.updateUser(id, updateUserDto);
    }

    async onModuleInit() {
        this.client.subscribeToResponseOf('get-user');
    }
}
