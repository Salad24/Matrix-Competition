const socket = io('https://matrix-competition.onrender.com'); // Backend URL

// Connection status
socket.on('connect', () => {
    console.log('Connected to the server');
});

socket.on('disconnect', () => {
    console.log('Disconnected from the server');
});

// Error handling
socket.on('connect_error', (err) => {
    console.error('Connection Error:', err);
});

// Function to update the display and local storage
function updateDisplay(data) {
    document.getElementById('output').innerText = `Update: ${data}`;
    // Save the update to local storage
    localStorage.setItem('currentData', data);
}

// Load saved data on page load
window.onload = function() {
    const savedData = localStorage.getItem('currentData');
    if (savedData) {
        updateDisplay(savedData);
    }
};

// Room creation
document.getElementById('createRoomBtn').onclick = function() {
    const roomName = document.getElementById('roomName').value;
    const password = document.getElementById('password').value;
    if (roomName && password) {
        socket.emit('createRoom', { roomName, password });
    } else {
        alert('Please enter a valid room name and password');
    }
};

// Join an existing room
document.getElementById('joinRoomBtn').onclick = function() {
    const roomName = document.getElementById('roomName').value;
    const password = document.getElementById('password').value;
    if (roomName && password) {
        socket.emit('joinRoom', { roomName, password });
    } else {
        alert('Please enter a valid room name and password');
    }
};

// Handle room creation and joining
socket.on('roomCreated', (roomName) => {
    console.log(`Room ${roomName} created successfully`);
    alert(`Room ${roomName} created!`);
    showCompetitionSection();
});

socket.on('roomJoined', (roomName) => {
    console.log(`Joined room ${roomName}`);
    alert(`Joined room ${roomName} successfully!`);
    showCompetitionSection();
});

// Error handling for room actions
socket.on('error', (message) => {
    console.error('Error:', message);
    alert(message);
});

// Show the competition section (after room creation/joining)
function showCompetitionSection() {
    document.getElementById('room-section').style.display = 'none';
    document.getElementById('competition-section').style.display = 'block';
}

// Sending matrix operations
document.getElementById('submit').onclick = function() {
    const operation = document.getElementById('operation').value;
    const roomName = document.getElementById('roomName').value; // Ensure the user is in the right room
    if (operation && roomName) {
        socket.emit('operation', { roomName, operation });
    } else {
        console.log('Please enter a valid operation and ensure you are in a room');
    }
};

// Receiving matrix updates
socket.on('update', (data) => {
    console.log('Received update:', data);
    updateDisplay(data); // Update the display and store it in local storage
});

// Test button functionality
document.getElementById('testButton').onclick = function() {
    const testMessage = 'Test connection successful!';
    socket.emit('test', testMessage);
};

// Listening for test responses
socket.on('testResponse', (message) => {
    console.log('Received test response:', message);
    document.getElementById('output').innerText = `Test Response: ${message}`;
});
