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

// Sending operations
document.getElementById('submit').onclick = function() {
    const operation = document.getElementById('operation').value;
    if (operation) {
        socket.emit('operation', operation);
    } else {
        console.log('Please enter a valid operation');
    }
};

// Receiving updates
socket.on('update', (data) => {
    console.log('Received update:', data);
    updateDisplay(data); // Update display and store in local storage
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
