const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);

// Set up Socket.IO with CORS configuration
const io = socketIo(server, {
    cors: {
        origin: "https://salad24.github.io",  // Your GitHub Pages URL
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Apply CORS middleware to Express
app.use(cors({
    origin: "https://salad24.github.io",  // Your GitHub Pages URL
    methods: ["GET", "POST"],
    credentials: true
}));

// Serve static files (if applicable)
app.use(express.static(path.join(__dirname, '../')));

// Route to serve index.html or other static files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

// Room management
let rooms = {}; // { roomName: { password, players: [] } }

io.on('connection', (socket) => {
    console.log('A user connected');

    // Create room
    socket.on('createRoom', ({ roomName, password }) => {
        if (Object.keys(rooms).length >= 5) {
            socket.emit('error', 'Maximum number of rooms reached');
            return;
        }

        if (rooms[roomName]) {
            socket.emit('error', 'Room name already taken');
            return;
        }

        rooms[roomName] = {
            password,
            players: [socket.id]
        };
        socket.join(roomName);
        socket.emit('roomCreated', roomName);
        console.log(`Room ${roomName} created`);
    });

    // Join room
    socket.on('joinRoom', ({ roomName, password }) => {
        const room = rooms[roomName];

        if (!room) {
            socket.emit('error', 'Room does not exist');
            return;
        }

        if (room.password !== password) {
            socket.emit('error', 'Invalid password');
            return;
        }

        if (room.players.length >= 2) {
            socket.emit('error', 'Room is full');
            return;
        }

        room.players.push(socket.id);
        socket.join(roomName);
        socket.emit('roomJoined', roomName);
        console.log(`User joined room ${roomName}`);
    });

    // Operation within a room
    socket.on('operation', ({ roomName, operation }) => {
        io.to(roomName).emit('update', operation); // Broadcast updates only to the specific room
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected');
        // Remove user from any room they're in
        for (const roomName in rooms) {
            const room = rooms[roomName];
            room.players = room.players.filter(player => player !== socket.id);

            if (room.players.length === 0) {
                delete rooms[roomName]; // Remove the room if empty
                console.log(`Room ${roomName} deleted`);
            }
        }
    });
});

// Start the server and listen on the appropriate port
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
