const socket = io();

const loginSection = document.getElementById('login');
const chatSection = document.getElementById('chat');
const loginForm = document.getElementById('login-form');
const nameInput = document.getElementById('name-input');
const loginError = document.getElementById('login-error');
const userName = document.getElementById('user-name');

let myName = '';

loginForm.addEventListener('submit', (e) => {
  e.preventDefault(); // evita que la página se recargue

  const name = nameInput.value.trim();

  if (name.length === 0) {
    loginError.textContent = 'El nom no pot estar buit.';
    return;
  }
  if (name.length > 20) {
    loginError.textContent = 'El nom pot tenir com a màxim 20 caràcters.';
    return;
  }

  myName = name;
  userName.textContent = myName;
  loginError.textContent = '';
  loginSection.hidden = true;
  chatSection.hidden = false;
});

//-------Enviar mensaje----------//

const messagesDiv = document.getElementById('messages');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');

// Enviar un mensaje
messageForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const text = messageInput.value.trim();
  if (text.length === 0 || text.length > 500) return;

  socket.emit('chat:send', { name: myName, text: text });
  messageInput.value = '';
});

// Recibir mensajes (se registra UNA sola vez, fuera de cualquier 'connect')
socket.on('chat:message', (msg) => {
  const div = document.createElement('div');
  div.classList.add('message');

  const hora = new Date(msg.time).toLocaleTimeString();

  const author = document.createElement('strong');
  author.textContent = msg.name;

  const time = document.createElement('small');
  time.textContent = ' ' + hora;

  const text = document.createElement('p');
  text.textContent = msg.text;

  div.append(author, time, text);
  messagesDiv.appendChild(div);

  // Baja al último mensaje
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

//-------Estado de conexión--------//

const statusSpan = document.getElementById('status');
const sendButton = messageForm.querySelector('button');

function setConnected(connected) {
  statusSpan.textContent = connected ? 'Connectat' : 'Desconnectat';
  messageInput.disabled = !connected;
  sendButton.disabled = !connected;
}

socket.on('connect', () => {
  setConnected(true);
});

socket.on('disconnect', () => {
  setConnected(false);
});

// Estado inicial correcto si la página se carga ya conectada o no
setConnected(socket.connected);