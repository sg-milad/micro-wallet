import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
    name: 'wallet',
})
export class WalletEntity {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id: string;

    @Column({ type: 'decimal', nullable: true, default: 0 })
    amount: number

    @Column({ type: 'uuid', name: 'user_id' })
    userId: string
}
