import {
    Entity,
    Column,
} from 'typeorm';
import BaseModel from './base.model';
import { Gender } from '../common/enum/gender.enum';


@Entity({
    name: 'user',
})
export class UserEntity extends BaseModel {

    @Column({ length: 200, unique: true, })
    Username: string;

    @Column({ length: 200, nullable: true })
    firstName: string;

    @Column({ length: 200, nullable: true })
    lastName: string;

    @Column({ type: 'enum', enum: Gender, default: Gender.OTHER })
    gender: Gender;
}
