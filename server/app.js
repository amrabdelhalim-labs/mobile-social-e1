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
app.use('/', router);
app.use('/images', express.static('public/images'));

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Error handler عام
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    console.error('Stack:', err.stack);

    if (err.name === 'MulterError') {
        return res.status(400).json({ message: err.message });
    }

    if (err.message === 'يجب أن تكون الملفات من نوع صورة فقط!') {
        return res.status(400).json({ message: err.message });
    }

    return res.status(500).json({ message: 'خطأ غير متوقع في الخادم' });
});

// Initialize database and start server
const initializeServer = async () => {
  try {
    await db.authenticate();
    console.log('✅ Database connection established successfully');
    
    await db.sync({ alter: true });
    console.log('✅ Database synced successfully');
    
    app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'production'}`);
    });
  } catch (error) {
    console.error('❌ Failed to initialize server:', error.message);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  await db.close();
  process.exit(0);
});

initializeServer();