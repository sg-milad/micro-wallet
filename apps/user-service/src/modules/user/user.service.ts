import { HttpException, HttpStatus, Inject, Injectable, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { ClientKafka } from '@nestjs/microservices';
import { CreateUserEvent } from './event/create-user.event';
import { map } from 'rxjs';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserEvent } from './event/update-user.event';
import { LoggerService } from '../../common/logger/logger.service';
import { GetUserAmount } from './event/get-user-amount.message';
@Injectable()
export class UserService {
    private readonly logger = new LoggerService(UserService.name);
    constructor(
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
        @Inject('Wallet-Service') private readonly client: ClientKafka
    ) { }
    async createUser(createUser: CreateUserDto) {
        try {
            const existingUser = await this.userRepository.findOne({
                where: { Username: createUser.Username },
            });

            if (existingUser) {
                throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
            }

            const newUser = await this.userRepository.save(createUser);

            this.emitUserCreatedEvent(newUser.id);

            return newUser;
        } catch (err) {
            if (err.code === '23505') {
                throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
            }
            throw err;
        }
    }

    async getUserInfo(id: string) {
        const user = await this.findUserById(id);

        return this.client.send('get-user', user.id).pipe(
            map((data: any) => {
                delete data.id;
                delete data.userId;
                return Object.assign(user, data);
            }),
        );
    }

    async updateUser(id: string, updateUserDto: UpdateUserDto) {
        try {
            const user = await this.findUserById(id);

            if (updateUserDto.Username) {
                await this.checkUsernameUniqueness(id, updateUserDto.Username);
            }

            if (updateUserDto.amount) {
                this.emitUserUpdatedEvent(user.id, updateUserDto.amount);
            }

            return await this.updateUserInfo(user, updateUserDto);
        } catch (err) {
            throw err;
        }
    }

    private async findUserById(id: string) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
        }
        return user
    }

    private async checkUsernameUniqueness(userId: string, username: string) {
        const existingUser = await this.userRepository.findOne({
            where: { Username: username },
        });

        if (existingUser) {
            throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
        }
    }

    private async updateUserInfo(user: Partial<UserEntity>, prop: Partial<UserEntity>) {
        Object.assign(user, { ...prop });
        return await this.userRepository.save(user);
    }

    private emitUserCreatedEvent(userId: string) {
        this.client.emit('user-created', new CreateUserEvent(userId));
    }

    private emitUserUpdatedEvent(userId: string, amount: number) {
        this.client.emit('user-updated', new UpdateUserEvent(userId, amount));
    }

    async getUserAmount(getUserAmount: GetUserAmount) {
        this.logger.log('getUserAmount', getUserAmount.amount);
    }
}
