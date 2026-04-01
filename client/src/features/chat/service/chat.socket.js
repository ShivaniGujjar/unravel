import { io } from 'socket.io-client';

// 🚀 Create the socket WITHOUT connecting immediately
// This prevents it from connecting with 'undefined' before the user logs in.
export const socket = io('http://localhost:3000', {
  autoConnect: false, // 👈 Important: Don't connect yet!
  withCredentials: true,
});

// ⚡ Helper to connect with the LATEST User ID
export const initializeSocketConnection = () => {
  // 1. Get the most fresh data from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?._id || user?.id;

  if (userId) {
    // 2. Update the "query" with the real ID before connecting
    socket.io.opts.query = { userId };
    
    if (!socket.connected) {
      socket.connect();
      console.log(`📡 Attempting to connect socket for User: ${userId}`);
    }
  } else {
    console.warn("⚠️ Cannot initialize socket: No User ID found in localStorage.");
  }
  
  return socket;
};

socket.on('connect', () => {
  console.log('✅ Connected to Socket.io server. Socket ID:', socket.id);
});

socket.on('connect_error', (err) => {
  console.error('❌ Socket Connection Error:', err.message);
});