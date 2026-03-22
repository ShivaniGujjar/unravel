import {Server} from 'socket.io';

let io;

export function initSocket (httpServer) {
  io = new Server(httpServer, {
    cors: { origin: 'http://localhost:5173', credentials: true },
  })
 
  console.log('Socket.io initialized');

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);
  })


};

  


  export const getIO = () => {  
    if (!io) {
        throw new Error('Socket.io not initialized');
    }
    return io;
  };
