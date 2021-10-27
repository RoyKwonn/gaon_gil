const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use('/assets', express.static(__dirname + '/public/assets'));
app.use('/images', express.static(__dirname + '/public/images'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/main.html');
});

app.get('/index', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/news', (req, res) => {
    res.sendFile(__dirname + '/news.html');
});

app.get('/design.html', function (req, res) {
    res.sendFile(__dirname + '/design.html');
});


var mysql = require('mysql');
var connection = mysql.createConnection({
    host: '34.146.81.27',
    user: 'ubuntu',
    password: 'zmffhqk',
    database: 'Crime'
});

connection.connect();

//connection.query('SELECT 살인, 강도, 강간강제추행, 절도, 폭력 FROM Crime.crime_data where 지역 = "강남구"', (error, rows, fields) => {
//    if (error) throw error;
//    console.log('User info is: ', rows);
//});


io.on('connection', (socket) => {
    socket.on('msg', (msg) => {
        io.emit('msg', msg);
        console.log(msg);
    });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});
