import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum SupplierStatus {
  DRAFT = 'DRAFT',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

@Entity()
export class Supplier {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  companyName: string;

  @Column({ type: 'varchar', unique: true })
  vatId: string;

  @Column({ type: 'varchar' })
  country: string;

  @Column({ type: 'varchar' })
  contactEmail: string;

  @Column({
    type: 'varchar',
    default: SupplierStatus.DRAFT
  })
  status: SupplierStatus;

  @Column({ type: 'varchar' })
  createdBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'varchar', nullable: true })
  approvedBy?: string;

  @Column({ type: 'varchar', nullable: true })
  rejectedBy?: string;

  @Column({ type: 'varchar', nullable: true })
  rejectionReason?: string;
}
