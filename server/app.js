import 'dotenv/config';
import express from 'express';
import router from './routes/index.js';
import cors from 'cors';
import morgan from 'morgan';
import db from './models/database.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use('/api', router);

db.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});