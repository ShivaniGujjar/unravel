import http from 'http';
import dotenv from 'dotenv';
import { app, attachSocket } from './src/app.js'; // 👈 Import both app and attachSocket
import { connectDB } from './src/config/database.js';
import { initSocket } from './src/sockets/server.socket.js';
import { testAi } from './src/services/ai.service.js';

// 1. Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;

// 2. Create the HTTP Server using the Express app
const httpServer = http.createServer(app);

// 3. 🚀 INITIALIZE SOCKET.IO
// This calls your socket configuration and returns the 'io' instance
const io = initSocket(httpServer);

// 4. 🚀 ATTACH SOCKET TO EXPRESS
// This passes the 'io' instance into the middleware we wrote in app.js
// so that 'req.io' works in your controllers!
attachSocket(io);

// 5. Connect to MongoDB
connectDB();

// 6. Test AI connection (Optional, for debugging)
try {
    testAi();
    console.log("AI Service connection verified.");
} catch (error) {
    console.error("AI Service test failed:", error.message);
}

// 7. Start the Server
httpServer.listen(PORT, () => {
    console.log(`-------------------------------------------`);
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`🔗 Frontend URL: http://localhost:5173`);
    console.log(`📡 Socket.io is active and attached to req.io`);
    console.log(`-------------------------------------------`);
});