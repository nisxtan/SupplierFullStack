import { Repository } from 'typeorm';
import { Supplier, SupplierStatus } from '../entities/Supplier';
import { AppDataSource } from '../config/data-source';

export class SupplierService {
  private repository: Repository<Supplier>;

  constructor(repository: Repository<Supplier> = AppDataSource.getRepository(Supplier)) {
    this.repository = repository;
  }

  async getAll(): Promise<Supplier[]> {
    return this.repository.find({ order: { createdAt: 'DESC' } });
  }

  async getById(id: string): Promise<Supplier | null> {
    return this.repository.findOneBy({ id });
  }

  async create(data: Partial<Supplier>, creatorId: string): Promise<Supplier> {
    this.validateBasicFields(data);

    const existing = await this.repository.findOneBy({
      vatId: (data.vatId || '').trim()
    });

    if (existing) {
      throw this.createError('VAT_ID_ALREADY_EXISTS', 'VAT ID already exists.');
    }

    const supplier = this.repository.create({
      ...data,
      vatId: data.vatId?.trim(),
      status: SupplierStatus.DRAFT,
      createdBy: creatorId
    });

    return this.repository.save(supplier);
  }

  async submit(id: string): Promise<Supplier> {
    const supplier = await this.getSupplierOrThrow(id);

    if (supplier.status !== SupplierStatus.DRAFT) {
      throw this.createError('INVALID_STATUS_TRANSITION', 'Only DRAFT suppliers can be submitted.');
    }

    supplier.status = SupplierStatus.PENDING_APPROVAL;
    return this.repository.save(supplier);
  }

  async approve(id: string, approverId: string): Promise<Supplier> {
    const supplier = await this.getSupplierOrThrow(id);

    if (supplier.status !== SupplierStatus.PENDING_APPROVAL) {
      throw this.createError('INVALID_STATUS_TRANSITION', 'Only PENDING_APPROVAL suppliers can be approved.');
    }

    if (supplier.createdBy === approverId) {
      throw this.createError('SELF_APPROVAL_NOT_ALLOWED', 'Creator cannot approve their own supplier.');
    }

    supplier.status = SupplierStatus.APPROVED;
    supplier.approvedBy = approverId;
    return this.repository.save(supplier);
  }

  async reject(id: string, rejectorId: string, reason: string): Promise<Supplier> {
    const supplier = await this.getSupplierOrThrow(id);

    if (supplier.status !== SupplierStatus.PENDING_APPROVAL) {
      throw this.createError('INVALID_STATUS_TRANSITION', 'Only PENDING_APPROVAL suppliers can be rejected.');
    }

    if (supplier.createdBy === rejectorId) {
      throw this.createError('SELF_APPROVAL_NOT_ALLOWED', 'Creator cannot reject their own supplier.');
    }

    if (!reason || reason.trim() === '') {
      throw this.createError('REJECTION_REASON_REQUIRED', 'Rejection requires a non-empty reason.');
    }

    supplier.status = SupplierStatus.REJECTED;
    supplier.rejectedBy = rejectorId;
    supplier.rejectionReason = reason.trim();
    return this.repository.save(supplier);
  }

  private async getSupplierOrThrow(id: string): Promise<Supplier> {
    const supplier = await this.getById(id);
    if (!supplier) {
      throw this.createError('SUPPLIER_NOT_FOUND', 'Supplier not found.');
    }
    return supplier;
  }

  private validateBasicFields(data: Partial<Supplier>) {
    if (!data.companyName || data.companyName.trim() === '') {
      throw this.createError('VALIDATION_ERROR', 'companyName is required.');
    }
    if (!data.vatId || data.vatId.trim() === '') {
      throw this.createError('VALIDATION_ERROR', 'vatId is required.');
    }
    if (!data.country || data.country.trim() === '') {
      throw this.createError('VALIDATION_ERROR', 'country is required.');
    }
    if (!data.contactEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contactEmail)) {
      throw this.createError('VALIDATION_ERROR', 'A valid contactEmail is required.');
    }
  }

  private createError(code: string, message: string): Error {
    const error = new Error(message);
    error.name = code;
    return error;
  }
}
