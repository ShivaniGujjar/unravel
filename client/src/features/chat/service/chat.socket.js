import {io} from 'socket.io-client';

export const initializeSocketConnection = () => {
  const socket = io('http://localhost:3000', {
    
    withCredentials: true, // ✅ include cookies
  });

  socket.on('connect', () => {
    console.log('Connected to Socket.io server');
  });
  
};