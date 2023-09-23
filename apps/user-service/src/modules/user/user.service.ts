import { HttpException, Inject, Injectable, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { ClientKafka } from '@nestjs/microservices';
import { CreateUserEvent } from './create-user.event';
import { map } from 'rxjs';
@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
        @Inject('Wallet-Service') private readonly client: ClientKafka
    ) { }
    async createUser(createUser: CreateUserDto) {
        try {
            const user = this.userRepository.create(createUser);
            const result = await this.userRepository.save(user);
            this.client.emit('user-created', new CreateUserEvent(result.id));

            return result

        } catch (err) {
            if (err.code === '23505') {
                throw new HttpException('User already exists', 400);
            }
        }

    }

    async getUserInfo(id: string) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new HttpException('User not found', 400);
        }
        return this.client.send('get-user', user.id).pipe(map((data: any) => {
            return Object.assign(user, data);
        }));
    }
}
