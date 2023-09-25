import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateUserEvent } from './event/create-user.event';
import { InjectRepository } from '@nestjs/typeorm';
import { WalletEntity } from './entities/wallet.entity';
import { GetUserInfoMessage } from './message/get-user-info.message';
import { UpdateUserEvent } from './event/update-user.event';
import { UpdateUserAmountEvent } from './event/update-user-amount.event';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { GetUserAmount } from './message/get-user-amount.message';
import { UpdateUserAmountDto } from './dto/update-user-amount.dto';
import { ClientKafka } from '@nestjs/microservices';


@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(WalletEntity) private readonly walletRepository: Repository<WalletEntity>,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
    @Inject('User-Service') private readonly client: ClientKafka
  ) { }
  async handleCreateUser(createUserEvent: CreateUserEvent) {
    const user = await this.findUserById(createUserEvent.userId);

    if (!user) {
      await this.createWallet(createUserEvent.userId);
    }
  }

  async getUserInfo(id: string) {
    const user = await this.findUserById(id);

    if (user) {
      return new GetUserInfoMessage(user.id, user.amount, user.userId);
    }

    return null;
  }

  async handleUpdateUser(updateUserEvent: UpdateUserEvent) {
    const { userId, amount } = updateUserEvent;
    const user = await this.findUserById(userId);

    if (user) {
      user.amount = amount;
      await this.walletRepository.save(user);
    }
  }

  async updateUserAmount(id: string, updateUserAmountDto: UpdateUserAmountDto) {
    const user = await this.findUserById(id);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }

    user.amount = updateUserAmountDto.amount;
    await this.walletRepository.save(user);

    this.emitUserAmountUpdatedEvent(user.id, updateUserAmountDto.amount);

    await this.cacheUser(id, user);
    return Object.assign(user, updateUserAmountDto);
  }

  async getUserAmount(id: string) {
    const cachedUser = await this.getCachedUser(id);

    if (cachedUser) {
      this.emitGetUserAmountEvent(cachedUser.amount);
      return { amount: cachedUser.amount }
    }

    const user = await this.findUserById(id);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    await this.cacheUser(id, user);
    this.client.emit('get-user-amount', new GetUserAmount(cachedUser.amount));
    return { amount: user.amount }
  }

  private async findUserById(id: string) {
    return this.walletRepository.findOne({ where: { userId: id } });
  }

  private async createWallet(userId: string) {
    await this.walletRepository.save({ userId });
  }

  private async cacheUser(id: string, user: WalletEntity) {
    await this.cacheService.set(id, user, 6000);
  }

  private async getCachedUser(id: string) {
    return this.cacheService.get<{ amount: number }>(id);
  }

  private emitUserAmountUpdatedEvent(userId: string, amount: number) {
    this.client.emit('user-amount-updated', new UpdateUserAmountEvent(userId, amount));
  }

  private emitGetUserAmountEvent(amount: number) {
    this.client.emit('get-user-amount', new GetUserAmount(amount));
  }
}
