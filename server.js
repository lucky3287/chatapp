const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(express.static(path.join(__dirname, 'public')));

const users = new Map();

io.on('connection', (socket) => {
  console.log('User connected');

  socket.on('join', (username) => {
    users.set(socket.id, username);
    io.emit('userJoined', username);
    io.emit('userList', Array.from(users.values()));
  });

  socket.on('message', (message) => {
    const username = users.get(socket.id);
    io.emit('message', {
      username,
      text: message,
      time: new Date().toLocaleTimeString()
    });
  });

  socket.on('disconnect', () => {
    const username = users.get(socket.id);
    users.delete(socket.id);
    io.emit('userLeft', username);
    io.emit('userList', Array.from(users.values()));
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});