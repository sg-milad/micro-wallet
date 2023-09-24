import { HttpException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateUserEvent } from './create-user.event';
import { InjectRepository } from '@nestjs/typeorm';
import { WalletEntity } from './entities/wallet.entity';
import { GetUserInfoMessage } from './get-user-info-message';
import { UpdateUserEvent } from './update-user.event';


@Injectable()
export class WalletService {
  constructor(@InjectRepository(WalletEntity) private readonly walletRepository: Repository<WalletEntity>,) { }
  async handelCreateUser(createUserEvent: CreateUserEvent) {
    const saveUser = await this.walletRepository.save({ userId: createUserEvent.id });
    console.log(saveUser);
  }

  async getUserInfo(id: string) {
    const user = await this.walletRepository.findOne({ where: { userId: id } });
    if (!user) {
      throw new HttpException('User not found', 400);
    }

    return new GetUserInfoMessage(user.id, user.amount, user.userId);
  }
  async handelUpdateUser(updateUserEvent: UpdateUserEvent) {

    const user = await this.walletRepository.findOne({ where: { userId: updateUserEvent.userId } });

    user.amount = updateUserEvent.amount;

    const saveUser = await this.walletRepository.save(user);

  }
}
