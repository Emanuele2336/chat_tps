const input = document.getElementById("input");
const button = document.getElementById("sendButton");
const chat = document.getElementById("chat");

const template = "<li class=\"list-group-item\">%MESSAGE</li>";
const messages = [];

const socket = io();  // Creiamo la connessione con il server WebSocket

// Gestiamo l'invio del messaggio quando l'utente preme "Invia" o il tasto Invio
input.onkeydown = (event) => {
  if (event.keyCode === 13) {  // Tasto Enter
    event.preventDefault();
    button.click();
  }
}

button.onclick = () => {
  socket.emit("message", input.value);  // Invia il messaggio al server
  input.value = "";  // Svuota il campo di input
}

// Gestiamo i messaggi ricevuti dal server
socket.on("chat", (message) => {
  console.log(message);
  messages.push(message);
  render();  // Renderizza la lista dei messaggi
});

// Funzione per visualizzare i messaggi
const render = () => {
  let html = "";
  messages.forEach((message) => {
    const row = template.replace("%MESSAGE", message);
    html += row;
  });
  chat.innerHTML = html;  // Aggiorna la lista dei messaggi
  window.scrollTo(0, document.body.scrollHeight);  // Scrolla fino al messaggio più recente
}