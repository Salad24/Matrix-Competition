const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors'); // Import CORS
const path = require('path');

const app = express();
const server = http.createServer(app);

// Set up Socket.IO with CORS configuration
const io = socketIo(server, {
    cors: {
        origin: "https://salad24.github.io",  // Your GitHub Pages URL
        methods: ["GET", "POST"],
        credentials: true // Allows sending cookies if needed
    }
});

// Apply CORS middleware to Express
app.use(cors({
    origin: "https://salad24.github.io",  // Your GitHub Pages URL
    methods: ["GET", "POST"],
    credentials: true // Allows credentials if needed
}));

// Serve static files (if applicable)
app.use(express.static(path.join(__dirname, '../')));

// Route to serve index.html or other static files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

// Handle Socket.IO connections and events
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('operation', (data) => {
        io.emit('update', data); // Broadcast updates to all connected clients
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Start the server and listen on the appropriate port
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
