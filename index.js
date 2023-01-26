const express = require('express');
const cors = require("cors");
const app = express();
const server = require('http').Server(app);
const path = require('path')

baseurl = '*'
// baseurl = 'http://103.190.95.231:4200'

const io = require('socket.io')(server, {
    cors: {
        origin: baseurl,
        methods: ["GET", "POST", "PUT", "DELETE"],
    },
});

var corsOptions = {
    origin: baseurl, // specifies a URI that may access the response
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ["GET", "POST", "PUT", "DELETE"]
};

app.use(cors(corsOptions));

app.use(express.json());

app.use('/static', express.static('public'));

const chatRouter = require('./app/routes/messages.route');
app.use('/api/chats', chatRouter);

app.get('/chatImg/:name', (req, res) => {
    const directoryPath = __basedir + "/assets/chatImg/" + req.params.name;
    res.download(directoryPath);
});

app.get('/**', (req, res) => {
    return res.sendfile(path.join(__dirname + '/public/index.html'));
});

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId);
        socket.broadcast.to(roomId).emit('user-connected', userId);

        socket.on('change-controls-server', (roomId, data) => {
            console.log(data);
            socket.broadcast.to(roomId).emit('change-controls-client', data);
        })

        socket.on('send-message', (roomId, data) => {
            console.log(roomId, data);
            socket.broadcast.to(roomId).emit('receive-message', data);
        })

        socket.on('disconnect', () => {
            socket.broadcast.to(roomId).emit('user-disconnected', userId);
        })
    });

})

PORT = 4500
server.listen(PORT,() => {
    console.log("Server run on http://localhost:" + PORT);
});