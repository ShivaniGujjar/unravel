import {Server} from 'socket.io';

let io;

export function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: { origin: 'http://localhost:5173', credentials: true },
  });
  
  console.log('Socket.io initialized');

  io.on('connection', (socket) => {
    // 🔍 DEBUG: Let's see exactly what the frontend is sending
    const userId = socket.handshake.query.userId; 

    if (userId && userId !== "undefined") {
      socket.join(userId); 
      console.log(`✅ User ${userId} connected and joined private room`);
    } else {
      console.log("⚠️ A client connected but provided no userId!");
    }

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io; // 🚀 THIS IS THE MISSING PIECE!
};

  


  export const getIO = () => {  
    if (!io) {
        throw new Error('Socket.io not initialized');
    }
    return io;
  };
