import { DataSource } from 'typeorm';
import { SupplierService } from '../services/SupplierService';
import { Supplier, SupplierStatus } from '../entities/Supplier';

let testDataSource: DataSource;
let service: SupplierService;

beforeAll(async () => {
  testDataSource = new DataSource({
    type: 'sqlite',
    database: ':memory:',
    entities: [Supplier],
    synchronize: true, // Creates tables automatically for tests
    logging: false
  });
  await testDataSource.initialize();
});

afterAll(async () => {
  if (testDataSource.isInitialized) {
    await testDataSource.destroy();
  }
});

beforeEach(async () => {
  await testDataSource.getRepository(Supplier).clear();
  service = new SupplierService(testDataSource.getRepository(Supplier));
});

describe('SupplierService', () => {
  const validSupplierData = {
    companyName: 'Test Corp',
    vatId: 'VAT123',
    country: 'USA',
    contactEmail: 'test@test.com'
  };

  it('Duplicate VAT ID rejected', async () => {
    await service.create(validSupplierData, 'Anna');
    
    await expect(service.create({
      ...validSupplierData,
      companyName: 'Another Corp'
    }, 'Max')).rejects.toThrowError(expect.objectContaining({ name: 'VAT_ID_ALREADY_EXISTS' }));
  });

  it('Self-approval blocked', async () => {
    const supplier = await service.create(validSupplierData, 'Anna');
    await service.submit(supplier.id);

    await expect(service.approve(supplier.id, 'Anna')).rejects.toThrowError(expect.objectContaining({ name: 'SELF_APPROVAL_NOT_ALLOWED' }));
  });

  it('Rejection without reason blocked', async () => {
    const supplier = await service.create(validSupplierData, 'Anna');
    await service.submit(supplier.id);

    await expect(service.reject(supplier.id, 'Max', '   ')).rejects.toThrowError(expect.objectContaining({ name: 'REJECTION_REASON_REQUIRED' }));
  });

  it('Valid status transition succeeds (DRAFT -> PENDING_APPROVAL -> APPROVED)', async () => {
    const supplier = await service.create(validSupplierData, 'Anna');
    expect(supplier.status).toBe(SupplierStatus.DRAFT);

    const submitted = await service.submit(supplier.id);
    expect(submitted.status).toBe(SupplierStatus.PENDING_APPROVAL);

    const approved = await service.approve(supplier.id, 'Max');
    expect(approved.status).toBe(SupplierStatus.APPROVED);
    expect(approved.approvedBy).toBe('Max');
  });

  it('Invalid status transition rejected (e.g. approving a DRAFT)', async () => {
    const supplier = await service.create(validSupplierData, 'Anna');

    await expect(service.approve(supplier.id, 'Max')).rejects.toThrowError(expect.objectContaining({ name: 'INVALID_STATUS_TRANSITION' }));
  });
});
