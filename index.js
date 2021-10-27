const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
//const { Server } = require("socket.io");
//const io = new Server(server);

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
	host : '34.146.81.27',
	user : 'ubuntu',
	password : 'zmffhqk',
	database : 'Crime'
});

connection.connect();



//io.on('connection', (socket) => {
//    socket.on('msg', (msg) => {

 //       connection.query('SELECT * FROM Crime.crime_data where 지역 = "서울"', (error, rows, fields) => {
   //         if(error) throw error;
     //       for(var i = 0; i < rows.length; i++) {
         //       console.log(rows[i].title + " : " + rows[i].description);
       //     }
            
      //      console.log('User info is: ', rows);
       //     });

       // io.emit('msg', 'dsfgdfgfdg');
      //  io.emit('msg', rows[0].title);
       // console.log( rows[0].title);
       


//    });
//});

server.listen(3000, () => {
    console.log('listening on *:3000');
});
