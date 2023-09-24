import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateUserEvent } from './event/create-user.event';
import { InjectRepository } from '@nestjs/typeorm';
import { WalletEntity } from './entities/wallet.entity';
import { GetUserInfoMessage } from './get-user-info-message';
import { UpdateUserEvent } from './event/update-user.event';
import { UpdateUserAmountEvent } from './event/update-user-amount.event';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { GetUserAmount } from './get-user-amount.message';


@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(WalletEntity) private readonly walletRepository: Repository<WalletEntity>,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) { }
  async handelCreateUser(createUserEvent: CreateUserEvent) {
    const user = await this.walletRepository.findOne({ where: { userId: createUserEvent.userId } });
    if (!user) {
      await this.walletRepository.save({ userId: createUserEvent.userId });
    }
  }

  async getUserInfo(id: string) {
    const user = await this.walletRepository.findOne({ where: { userId: id } });
    if (user) {
      return new GetUserInfoMessage(user.id, user.amount, user.userId);
    }
    return null
  }
  async handelUpdateUser(updateUserEvent: UpdateUserEvent) {
    const { userId, amount } = updateUserEvent;

    const user = await this.walletRepository.findOne({ where: { userId } });

    if (user) {
      user.amount = amount;
      await this.walletRepository.save(user);
    }
  }
  async handelUpdateUserAmount(updateUserAmountEvent: UpdateUserAmountEvent) {
    const { userId, amount } = updateUserAmountEvent;
    const user = await this.walletRepository.findOne({ where: { userId } });

    if (user) {
      user.amount = amount;
      await this.walletRepository.save(user);
      await this.cacheService.set(userId, user, 6000000000);
    }
  }
  async getUserAmount(id: string) {
    const cachedUser = await this.cacheService.get<{ amount: number }>(id);

    if (cachedUser) {
      return new GetUserAmount(cachedUser.amount);
    }

    const user = await this.walletRepository.findOne({ where: { userId: id } });

    if (user) {
      await this.cacheService.set(id, { amount: user.amount });
      return new GetUserAmount(user.amount);
    }
  }
}
