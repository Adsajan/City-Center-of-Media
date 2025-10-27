const http = require('http');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Server } = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app);

const ORIGIN = process.env.CLIENT_URL || 'http://localhost:5173';
const SOCKET_PORT = Number(process.env.SOCKET_PORT || process.env.PORT || 4001); // use 4001 by default to avoid API port clash

app.use(cors({ origin: ORIGIN, credentials: true }));

const io = new Server(server, {
  cors: {
    origin: ORIGIN,
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('✅ New client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

server.listen(SOCKET_PORT, () =>
  console.log(`Socket.io server running on port ${SOCKET_PORT}`)
);

