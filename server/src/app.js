import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import chatRoutes from './routes/chat.routes.js';

dotenv.config();



const app = express();

app.use(morgan('dev'));
app.use(cookieParser())
app.use(cors({
  origin: 'http://localhost:5173', // frontend URL
  credentials: true
}));


// Middleware
app.use(express.json());

// Auth routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);


// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});

export { app };
