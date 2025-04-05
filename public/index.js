const input = document.getElementById("input");
const button = document.getElementById("sendButton");
const chat = document.getElementById("chat");
const usernameModal = document.getElementById("usernameModal");
const usernameInput = document.getElementById("usernameInput");
const setUsernameButton = document.getElementById("setUsernameButton");
const userListElement = document.getElementById("userList");

const template = "<li class=\"list-group-item\">%USERNAME: %MESSAGE</li>";
const messages = [];
let username = null;
const socket = io();

const showUsernameModal = () => {
    usernameModal.classList.add("visible");
  };

const hideUsernameModal = () => {
    usernameModal.classList.remove("visible");
  };

setUsernameButton.onclick = () => {
  const enteredUsername = usernameInput.value.trim();
  if (enteredUsername) {
    username = enteredUsername;
    socket.emit("setUsername", username); 
    hideUsernameModal();
   
    socket.emit("list"); 
  } 
};

showUsernameModal();

input.onkeydown = (event) => {
  if (event.keyCode === 13 && username) {
    event.preventDefault();
    button.click();
  }
}


button.onclick = () => {
  if (username && input.value.trim()) {
    socket.emit("message", input.value);
    input.value = "";
  }
}

socket.on("chat", (data) => {
  console.log(data);
  messages.push(data);
  renderChat();
});

socket.on("list", (list) => {
  console.log("Lista utenti ricevuta:", list);
  renderUserList(list);
});

const renderChat = () => {
  let html = "";
  messages.forEach((item) => {
    const row = template.replace("%MESSAGE", item.message).replace("%USERNAME", item.username);
    html += row;
  });
  chat.innerHTML = html;
  window.scrollTo(0, document.body.scrollHeight);
}

const renderUserList = (userList) => {
  let html = "";
  userList.forEach((user) => {
    html += `<li>${user.name}</li>`;
  });
  userListElement.innerHTML = html;
};

socket.on('disconnect', () => {
  console.log('Disconnesso dal server');
  
});