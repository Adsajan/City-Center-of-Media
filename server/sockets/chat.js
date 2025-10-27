module.exports = function (io) {
  io.on('connection', (socket) => {
    // Client should emit { room } to join
    socket.on('join', ({ room }) => {
      if (room) {
        socket.join(room);
        io.to(room).emit('system', { text: `User joined ${room}` });
      }
    });

    // Broadcast chat messages in a room
    socket.on('message', ({ room, text, from }) => {
      if (!room || !text) return;
      io.to(room).emit('message', { room, text, from, at: new Date().toISOString() });
    });

    socket.on('disconnect', () => {
      // No-op for now
    });
  });
};

