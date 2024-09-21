const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the root directory
app.use(express.static(path.join(__dirname, '../'))); // Adjust as needed

// Serve index.html on root access
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html')); // Adjust to the root file
});

io.on('connection', (socket) => {
    console.log('A user connected');
    
    socket.on('operation', (data) => {
        io.emit('update', data);
    });

    socket.on('test', (message) => {
        socket.emit('testResponse', 'Test received!');
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
