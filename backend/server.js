// server.js - Main backend server file
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const cors = require('cors');
const { initializeDatabase, createRoom, getRoomById, addUserToRoom, removeUserFromRoom } = require('./database');

// Initialize the app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Initialize database
initializeDatabase();

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// API endpoints
app.post('/api/rooms', async (req, res) => {
  try {
    const roomId = await createRoom();
    res.json({ roomId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/rooms/:roomId', async (req, res) => {
  try {
    const room = await getRoomById(req.params.roomId);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    res.json(room);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Socket.io logic
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  
  // Join room
  socket.on('join-room', async ({ roomId, userId }) => {
    try {
      const room = await getRoomById(roomId);
      if (!room) {
        socket.emit('error', { message: 'Room not found' });
        return;
      }
      
      // Add user to room in database
      await addUserToRoom(roomId, userId);
      
      // Join the socket room
      socket.join(roomId);
      
      // Inform other users in the room
      socket.to(roomId).emit('user-connected', userId);
      
      console.log(`User ${userId} joined room ${roomId}`);
      
      // Handle WebRTC signaling
      socket.on('offer', ({ offer, to }) => {
        socket.to(to).emit('offer', { offer, from: socket.id });
      });
      
      socket.on('answer', ({ answer, to }) => {
        socket.to(to).emit('answer', { answer, from: socket.id });
      });
      
      socket.on('ice-candidate', ({ candidate, to }) => {
        socket.to(to).emit('ice-candidate', { candidate, from: socket.id });
      });
      
      // Handle disconnect
      socket.on('disconnect', async () => {
        console.log('User disconnected:', socket.id);
        await removeUserFromRoom(roomId, userId);
        socket.to(roomId).emit('user-disconnected', userId);
      });
    } catch (error) {
      console.error('Error joining room:', error);
      socket.emit('error', { message: error.message });
    }
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});