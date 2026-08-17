import express from 'express';
import cors from 'cors';
import 'express-async-errors';
import { Request, Response, NextFunction } from 'express';
import supplierRoutes from './routes/supplierRoutes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/suppliers', supplierRoutes);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  let status = 500;
  if (err.name === 'VALIDATION_ERROR' || err.name === 'REJECTION_REASON_REQUIRED') status = 400;
  if (err.name === 'SUPPLIER_NOT_FOUND') status = 404;
  if (err.name === 'VAT_ID_ALREADY_EXISTS' || err.name === 'INVALID_STATUS_TRANSITION' || err.name === 'SELF_APPROVAL_NOT_ALLOWED') status = 409;
  
  res.status(status).json({ code: err.name || 'INTERNAL_SERVER_ERROR', message: err.message });
});

export default app;
