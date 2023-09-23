import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';

@ApiTags('User')
@Controller("user")
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post()
    @ApiOperation({
        description: 'Create user'
    })
    async createUser(@Body() createUserDto: CreateUserDto) {
        console.log(createUserDto);
        return await this.userService.createUser(createUserDto);
    }
}
