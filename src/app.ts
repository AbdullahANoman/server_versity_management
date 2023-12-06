import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFoundHandler from './app/middlewares/notFoundHandler';
import router from './app/route';
const app: Application = express();

//parser
app.use(express.json());
app.use(cors());

// application route
app.use('/api/v1', router);

app.get('/', (req: Request, res: Response) => {
  res.send('I love to work on backend 🚀');
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.use(globalErrorHandler);
app.use(notFoundHandler);
export default app;
