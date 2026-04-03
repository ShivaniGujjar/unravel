import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import cors from 'cors'; // Pehle se import hai, niche require ki zaroorat nahi
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import chatRoutes from './routes/chat.routes.js';

dotenv.config();
const app = express();

// 1. Basic Middlewares
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json()); // Ye line zaroori hai JSON data read karne ke liye

// ✅ CORS Fix: Yahan 'require' hata kar sirf ye use karo
app.use(cors({
    origin: ["https://unravel-liart.vercel.app", "http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"] // Headers bhi define kar diye safety ke liye
}));

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

// 4. Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});

export { app };