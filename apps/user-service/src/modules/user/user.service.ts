import { HttpException, Inject, Injectable, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { ClientKafka } from '@nestjs/microservices';
import { CreateUserEvent } from './create-user.event';
import { map } from 'rxjs';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserEvent } from './update-user.event';
@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
        @Inject('Wallet-Service') private readonly client: ClientKafka
    ) { }
    async createUser(createUser: CreateUserDto) {
        try {
            const user = await this.userRepository.findOne({ where: { Username: createUser.Username } });
            if (user) {
                throw new HttpException('User already exists', 400);
            }
            const result = await this.userRepository.save(createUser);

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
            delete data.id
            delete data.userId
            return Object.assign(user, data);
        }));
    }

    async updateUser(id: string, updateUserDto: UpdateUserDto) {
        try {
            const { amount, ...updateUser } = updateUserDto
            const user = await this.userRepository.findOne({ where: { id } });
            if (!user) {
                throw new HttpException('User not found', 400);
            }
            if (amount) {
                this.client.emit('user-updated', new UpdateUserEvent(user.id, amount));
            }

            return await this.updateUserInfo(user, updateUser);

        } catch (err) {
            if (err.code === '23505') {
                throw new HttpException('User already exists', 400);
            }
        }
    }

    async updateUserInfo(user: Partial<UserEntity>, prop: Partial<UserEntity>) {
        Object.assign(user, { ...prop })
        return await this.userRepository.save(user);
    }
}
