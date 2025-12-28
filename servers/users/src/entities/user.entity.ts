
import { UserStatus } from '../enums';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { AddressEntity } from './address.entity';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'first_name',
  })
  firstName: string;

  @Column({
    name: 'last_name',
  })
  lastName: string;

  @Column({ type: 'varchar', unique: true, name: 'email_address' })
  emailAddress: string;

  @Column({ type: 'varchar', name: 'phone_number' })
  phoneNumber: string;

  @Column({ type: 'varchar', name: 'profile_image_key' })
  profileImageKey: string;

  @Column({ type: 'varchar' })
  status: UserStatus;

  @Column({ type: 'timestamp', name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @OneToMany(type => AddressEntity, address => address.user)
  addresses: AddressEntity[];
}
