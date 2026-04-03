import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import chatRoutes from './routes/chat.routes.js';

dotenv.config();
const app = express();

// ✅ 1. CORS MUST BE FIRST — before everything
app.use(cors({
    origin: ["https://unravelit.netlify.app", "http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// ✅ 2. Handle OPTIONS preflight explicitly
app.options('*', cors());

// 3. Basic Middlewares
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());

// 🚀 4. Socket placeholder
let socketIO = null;
export const attachSocket = (io) => {
  socketIO = io;
};

app.use((req, res, next) => {
  req.io = socketIO;
  next();
});

// 5. Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});

export { app };