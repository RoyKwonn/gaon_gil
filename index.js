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

app.get('/board', (req, res) => {
    res.sendFile(__dirname + '/board.html');
});

app.get('/write', (req, res) => {
    res.sendFile(__dirname + '/write.html');
});



////****** 테스트 페이지*******////
app.get('/test', (req, res) => {
    res.sendFile(__dirname + '/test.html');
});

app.get('/test2', (req, res) => {
    res.sendFile(__dirname + '/test2.html');
});

app.get('/box', (req, res) => {
    res.sendFile(__dirname + '/box.html');
});


var mysql = require('mysql');
var connection = mysql.createConnection({
    host: '34.146.81.27',
    user: 'ubuntu',
    password: 'zmffhqk',
    database: 'Crime'
});

connection.connect();

// 좌표 데이터를 바탕으로 전국 '도' 범죄데이터를 받아온다.
io.on('connection', (socket) => {
    socket.on('send', (msg) => {
        var location = msg.split(',');
        connection.query('SELECT 살인, 강도, 성범죄, 절도, 폭력 FROM Crime.crime_data where ( X = \"' + location[0] + '\" and Y = \"' + location[1] + '\")', (error, rows, fields) => {
            if (error) throw error;
            io.to(socket.id).emit('response', rows);
        });
    });
});


// 좌표 데이터를 바탕으로'구'의 범죄데이터를 받아온다.
io.on('connection', (socket) => {
    socket.on('send_seoul', (msg) => {
        var location = msg.split(',');
        connection.query('SELECT 살인, 강도, 성범죄, 절도, 폭력 FROM Crime.seoul_data where ( X = \"' + location[0] + '\" and Y = \"' + location[1] + '\")', (error, rows, fields) => {
            if (error) throw error;
            io.to(socket.id).emit('response', rows);
        });
    });
});



// '도' 지역명, 좌표 데이터를 받아온다.
io.on('connection', (socket) => {
    socket.on('request_Nationwide_data', (msg) => {
        connection.query('SELECT 지역, X, Y FROM Crime.crime_data;', (error, rows, fields) => {
            if (error) throw error;
            io.to(socket.id).emit('Nationwide_data', rows);
        });
    });
});


// 서울의 '구' 지역명, 좌표 데이터를 받아온다.
io.on('connection', (socket) => {
    socket.on('request_Seoul_data', (msg) => {
        connection.query('SELECT 지역, X, Y FROM Crime.seoul_data; ', (error, rows, fields) => {
            if (error) throw error;
            io.to(socket.id).emit('Seoul_data', rows);
        });
    });
});



// 뉴스 데이터를 받아온다.
io.on('connection', (socket) => {
    socket.on('request_news', (msg) => {
        connection.query('select url, title, body, reporting_date,img from Crime.News_data order by reporting_date desc limit 8;', (error, rows, fields) => {
            if (error) throw error;
            io.to(socket.id).emit('news_data', rows);
        });
    });
});





/***********테스트 콘솔 출력***********/
io.on('connection', (socket) => {
    socket.on('msg_00', (msg) => {
        console.log(msg);
    });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});

//connection.end()