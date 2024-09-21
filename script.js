const socket = io('https://matrix-competition.onrender.com'); // Replace with your actual backend URL

document.getElementById('submit').onclick = function() {
    const operation = document.getElementById('operation').value;
    socket.emit('operation', operation);
};

socket.on('update', (data) => {
    // Update the matrix display with the new operation
    console.log('Received update:', data);
    document.getElementById('output').innerText = `Update: ${data}`;
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