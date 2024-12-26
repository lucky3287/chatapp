// Socket connection
const socket = io(window.location.origin);

// State
let username = '';

// Chat functions
function joinChat() {
    username = document.getElementById('username').value.trim();
    if (username) {
        document.getElementById('join-form').classList.add('hidden');
        document.getElementById('chat-container').classList.remove('hidden');
        socket.emit('join', username);
    }
}

function sendMessage() {
    const input = document.getElementById('message-input');
    const message = input.value.trim();
    if (message) {
        socket.emit('message', message);
        input.value = '';
    }
}

// Event listeners
document.getElementById('message-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

document.getElementById('username').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        joinChat();
    }
});

// Socket event handlers
socket.on('message', (data) => {
    const messages = document.getElementById('messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${data.username === username ? 'sent' : 'received'}`;
    messageDiv.innerHTML = `
        <div class="meta">
            <span class="username">${data.username}</span>
            <span class="time">${data.time}</span>
        </div>
        <div class="text">${data.text}</div>
    `;
    messages.appendChild(messageDiv);
    messages.scrollTop = messages.scrollHeight;
});

socket.on('userJoined', (user) => {
    const messages = document.getElementById('messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message system';
    messageDiv.innerHTML = `<div class="text">${user} joined the chat</div>`;
    messages.appendChild(messageDiv);
});

socket.on('userLeft', (user) => {
    if (user) {
        const messages = document.getElementById('messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message system';
        messageDiv.innerHTML = `<div class="text">${user} left the chat</div>`;
        messages.appendChild(messageDiv);
    }
});

socket.on('userList', (users) => {
    const usersList = document.getElementById('users-list');
    usersList.innerHTML = users
        .map(user => `<li>${user}</li>`)
        .join('');
});