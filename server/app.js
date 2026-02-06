import 'dotenv/config';
import express from 'express';
import router from './routes/index.js';
import cors from 'cors';
import morgan from 'morgan';
import db from './utilities/database.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json({ limit: '1mb' }));
app.use('/api', router);
app.use('/images', express.static('public/images'));

// Error handler عام
app.use((err, req, res, next) => {
    console.error(err);

    if (err.name === 'MulterError') {
        return res.status(400).json({ message: err.message });
    }

    if (err.message === 'يجب أن تكون الملفات من نوع صورة فقط!') {
        return res.status(400).json({ message: err.message });
    }

    return res.status(500).json({ message: 'خطأ غير متوقع في الخادم' });
});

db.sync({ alter: true }).then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});