import express from 'express';
import cors from 'cors';
import 'express-async-errors';
import { Request, Response, NextFunction } from 'express';
const app = express();

app.use(cors());
app.use(express.json());

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ code: 'INTERNAL_SERVER_ERROR', message: err.message });
});

export default app;
