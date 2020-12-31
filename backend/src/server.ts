import { createServer } from 'http';
import express from 'express';
import { Socket, Server } from 'socket.io';
import path from 'path'
import cors, { CorsOptions } from 'cors';

const PORT = process.env.PORT || 80;

const corsOptions: CorsOptions = {
    origin: ['http://localhost', 'http://localhost:3000'],
    credentials: true
};

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        credentials: true
    }
});

// CORS

app.use(cors(corsOptions));

app.use(express.static(path.join(__dirname, '../../frontend/build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/build', 'index.html'));
});

io.on('connection', (socket: Socket) => {
    console.log('User connected');

    let guestUsername = "Anonymous";
    let user: string;

    socket.on('sendGlobal', (message, done) => {
        console.log(message);
        socket.to('global_chat').emit('globalMessageRecive', {
            author: user == null ? `${guestUsername} (Guest)` : 'L',
            message
        });
        done({ author: guestUsername, message });
    });

    socket.on('joinGlobalRoom', () => {
        console.log('Joined global room');
        socket.join('global_chat');
    });

    socket.on('leaveGlobalRoom', () => {
        console.log('User leaving room');
        socket.leave('global_chat');
    });

    socket.on('changeGuestUsername', (username) => {
        guestUsername = username;
    });
});

server.listen(PORT, () => {
    console.log('Listening to port: ' + PORT);
});