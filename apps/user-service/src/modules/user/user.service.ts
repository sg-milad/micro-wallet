import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { ClientKafka } from '@nestjs/microservices';
@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
        @Inject('Wallet-Service') private readonly client: ClientKafka
    ) { }
    async createUser(createUser: CreateUserDto) {
        const user = this.userRepository.create(createUser);
        const result = await this.userRepository.save(user);
        const a = this.client.emit('user-created', result);
        console.log(a);

        return result

    }
}
