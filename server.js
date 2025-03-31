const fs = require('fs');
const express = require("express");
const http = require("http");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const { Server } = require('socket.io');  // Importiamo il Server di socket.io
const conf = JSON.parse(fs.readFileSync("./conf.json"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", express.static(path.join(__dirname, "public"))); // Serve file statici dalla cartella public

const server = http.createServer(app);
const io = new Server(server);

server.listen(conf.port, () => {
    console.log("Server in esecuzione sulla porta: " + conf.port);
});

io.on('connection', (socket) => {
    console.log("Socket connessa: " + socket.id);

    // Invia un messaggio di benvenuto a tutti i client
    io.emit("chat", "Nuovo cliente connesso: " + socket.id);

    // Ascoltiamo i messaggi dal client
    socket.on('message', (message) => {
        const response = socket.id + ": " + message;
        console.log(response);
        io.emit("chat", response); // Invia il messaggio a tutti i client
    });

    // Gestiamo la disconnessione
    socket.on('disconnect', () => {
        console.log("Socket disconnessa: " + socket.id);
    });
});