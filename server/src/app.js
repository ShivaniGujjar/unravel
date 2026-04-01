import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import chatRoutes from './routes/chat.routes.js';

dotenv.config();
const app = express();

// 1. Basic Middlewares
app.use(morgan('dev'));
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true
}));
app.use(express.json());

// 🚀 2. Create a placeholder for IO
let socketIO = null;
export const attachSocket = (io) => {
  socketIO = io;
};

// 🚀 3. Inject IO into every request BEFORE routes
app.use((req, res, next) => {
  req.io = socketIO;
  next();
});

// 4. Routes (Now they will have access to req.io)
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});

export { app };