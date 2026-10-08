const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const port = 3005;

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);

  socket.on('chat:send', (data) => {
    // Validación en el servidor
    if (!data || typeof data.name !== 'string' || typeof data.text !== 'string') {
      return;
    }

    const name = data.name.trim();
    const text = data.text.trim();

    if (name.length === 0 || name.length > 20) return;
    if (text.length === 0 || text.length > 500) return;

    // La hora la genera el servidor
    const message = {
      name,
      text,
      time: new Date().toISOString()
    };

    // io.emit envía a TODOS los clientes, incluido quien lo mandó
    io.emit('chat:message', message);
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

server.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});