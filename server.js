const fs = require('fs');
const express = require("express");
const http = require("http");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const { Server } = require('socket.io');
const conf = JSON.parse(fs.readFileSync("./conf.json"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", express.static(path.join(__dirname, "public")));

const server = http.createServer(app);
const io = new Server(server);
const userList = []; 

server.listen(5005, () => {
    console.log("Server in esecuzione sulla porta: " + conf.port);
});

io.on('connection', (socket) => {
    console.log("Socket connessa: " + socket.id);
    socket.on('setUsername', (username) => {
        const newUser = { socketId: socket.id, name: username };
        userList.push(newUser);
        io.emit("list", userList);
    });
    socket.on('list', () => {
        socket.emit("list", userList); 
    });

    socket.on('message', (message) => {
        let username = 'Anonimo';
        let userFound = false; 
        for (let i = 0; i < userList.length; i++) {
            if (userList[i].socketId === socket.id) {
                username = userList[i].name;
                userFound = true; 
                break;
            }
        }
        const response = { username: username, message: message };
        io.emit("chat", response);
    });
   
   
    socket.on('disconnect', () => {
        let userFound = false; 
        let username = ''; 
        for (let i = 0; i < userList.length; i++) {
            if (userList[i].socketId === socket.id) {
                userFound = true;
                username = userList[i].name;               
                userList.splice(i, 1);
                io.emit("chat", { username: 'Server', message: `${username} ha lasciato la chat.` });
                io.emit("list", userList);
                break;
            }
        }
    
    });
});