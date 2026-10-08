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