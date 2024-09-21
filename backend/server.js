const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const path = require('path');

app.use(express.static(path.join(__dirname, '../frontend'))); // Serve static files from 'frontend' directory

io.on('connection', (socket) => {
    console.log('A user connected');
    
    socket.on('operation', (data) => {
        io.emit('update', data); // Broadcast to all clients
    });

    socket.on('test', (message) => {
        console.log('Test message received:', message);
        socket.emit('testResponse', 'Test received!'); // Send response back to the client
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});