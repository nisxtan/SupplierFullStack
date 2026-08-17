import { Router } from 'express';
import { SupplierController } from '../controllers/SupplierController';

const router = Router();

router.get('/', SupplierController.getAll);
router.get('/:id', SupplierController.getById);
router.post('/', SupplierController.create);
router.post('/:id/submit', SupplierController.submit);
router.post('/:id/approve', SupplierController.approve);
router.post('/:id/reject', SupplierController.reject);

export default router;
