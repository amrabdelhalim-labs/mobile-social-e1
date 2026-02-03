import 'dotenv/config';
import express from 'express';
import userRouter from './routes/user.routes.js';
import cors from 'cors';
import morgan from 'morgan';
import db from './utilities/database.js';
import './models/index.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/account', userRouter);

db.sync({ alter: true }).then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});