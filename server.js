"use strict";
var __importDefault = (this && this.__importDefault) || function(mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("http");
var express_1 = __importDefault(require("express"));
var socket_io_1 = require("socket.io");
var path_1 = __importDefault(require("path"));
var cors_1 = __importDefault(require("cors"));
var PORT = process.env.PORT || 80;
var corsOptions = {
    origin: ['http://localhost', 'http://localhost:3000'],
    credentials: true
};
var app = express_1.default();
var server = http_1.createServer(app);
var io = new socket_io_1.Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        credentials: true
    }
});
// CORS
app.use(cors_1.default(corsOptions));
app.use(express_1.default.static(path_1.default.join(__dirname, './website')));
app.get('*', function(req, res) {
    res.sendFile(path_1.default.join(__dirname, './website', 'index.html'));
});
io.on('connection', function(socket) {
    console.log('User connected');
    var guestUsername = "Anonymous";
    var user;
    socket.on('sendGlobal', function(message, done) {
        console.log(message);
        socket.to('global_chat').emit('globalMessageRecive', {
            author: user == null ? guestUsername + " (Guest)" : 'L',
            message: message
        });
        done({ author: guestUsername, message: message });
    });
    socket.on('joinGlobalRoom', function() {
        console.log('Joined global room');
        socket.join('global_chat');
    });
    socket.on('leaveGlobalRoom', function() {
        console.log('User leaving room');
        socket.leave('global_chat');
    });
    socket.on('changeGuestUsername', function(username) {
        guestUsername = username;
    });
});
server.listen(PORT, function() {
    console.log('Listening to port: ' + PORT);
});