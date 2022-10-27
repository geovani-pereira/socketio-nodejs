"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("./http");
var users = [];
var messages = [];
var rooms = ['Jornada Unialfa'];
http_1.io.on("connection", function (socket) {
    //avisando que usuário desconectou
    socket.on("disconnect", function () {
        var userInRoom = users.find(function (user) { return user.socket_id == socket.id; });
        if (userInRoom) {
            http_1.io.to(userInRoom.room).emit("desconectou", "Usu\u00E1rio " + userInRoom.username + " saiu da sala.");
            socket.leave(userInRoom.room);
        }
    });
    socket.on('sala', function (data, callback) {
        if (!rooms.includes(data.room)) {
            rooms.push(data.room);
        }
        socket.join(data.room);
        var userInRoom = users.find(function (user) { return user.email == data.email && user.room === data.room; });
        if (userInRoom) {
            userInRoom.socket_id = socket.id;
        }
        else {
            users.push({
                room: data.room,
                email: data.email,
                socket_id: socket.id,
                username: data.username
            });
        }
        var messagesRoom = getMessagesRoom(data.room);
        callback(messagesRoom);
    });
    socket.on('message', function (data) {
        var message = {
            email: data.email,
            username: data.username,
            room: data.room,
            text: data.message,
            createdAt: new Date()
        };
        messages.push(message);
        http_1.io.to(data.room).emit("message", message);
    });
    socket.on('index', function (data, callback) {
        callback(rooms);
    });
});
function getMessagesRoom(room) {
    var messagesRoom = messages.filter(function (message) { return message.room == room; });
    return messagesRoom;
}
