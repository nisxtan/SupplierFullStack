import { Request, Response, NextFunction } from 'express';
import { SupplierService } from '../services/SupplierService';

const service = new SupplierService();

const getUserId = (req: Request) => {
  const userId = req.headers['x-user-id'] as string;
  return userId || 'Anna';
};

export class SupplierController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    const suppliers = await service.getAll();
    res.json(suppliers);
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const supplier = await service.getById(req.params.id);
      if (!supplier) {
        return res.status(404).json({ code: 'SUPPLIER_NOT_FOUND', message: 'Supplier not found.' });
      }
      res.json(supplier);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = getUserId(req);
      const supplier = await service.create(req.body, userId);
      res.status(201).json(supplier);
    } catch (error: any) {
      next(error);
    }
  }

  static async submit(req: Request, res: Response, next: NextFunction) {
    try {
      const supplier = await service.submit(req.params.id);
      res.json(supplier);
    } catch (error: any) {
      next(error);
    }
  }

  static async approve(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = getUserId(req);
      const supplier = await service.approve(req.params.id, userId);
      res.json(supplier);
    } catch (error: any) {
      next(error);
    }
  }

  static async reject(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = getUserId(req);
      const { reason } = req.body;
      const supplier = await service.reject(req.params.id, userId, reason);
      res.json(supplier);
    } catch (error: any) {
      next(error);
    }
  }
}
