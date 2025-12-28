import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity()
export class AddressEntity {
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @Column({ type: 'varchar', name: 'address_name' })
    addressName: string;

    @Column({ type: 'varchar', name: 'google_address_id' })
    googleAddressId: string;

    @Column({ type: 'varchar', name: 'formated_address' })
    formattedAddress: string;

    @Column({ type: 'varchar', name: 'is_default' })
    isDefault: boolean;
    
    @Column({ type: 'boolean', name: 'active' })
    active: boolean;

    @Column({ type: 'timestamp', name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @ManyToOne(type => UserEntity, user => user.addresses)
    user: UserEntity;
}