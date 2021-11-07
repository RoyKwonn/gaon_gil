const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use('/assets', express.static(__dirname + '/public/assets'));
app.use('/images', express.static(__dirname + '/public/images'));

app.get('/main', (req, res) => {
    res.sendFile(__dirname + '/main.html');
});

app.get('/index', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/news', (req, res) => {
    res.sendFile(__dirname + '/news.html');
});



/**********지역별 뉴스기사 라우팅*************/

//서울
app.get('/news/seoul', (req, res) => {
    res.sendFile(__dirname + '/news/seoul.html');
});

//경기
app.get('/news/gyeonggi', (req, res) => {
    res.sendFile(__dirname + '/news/gyeonggi.html');
});


//인천
app.get('/news/incheon', (req, res) => {
    res.sendFile(__dirname + '/news/incheon.html');
});


//부산
app.get('/news/busan', (req, res) => {
    res.sendFile(__dirname + '/news/busan.html');
});


//울산
app.get('/news/ulsan', (req, res) => {
    res.sendFile(__dirname + '/news/ulsan.html');
});


//경남
app.get('/news/gyeongsangnam', (req, res) => {
    res.sendFile(__dirname + '/news/gyeongsangnam.html');
});


//대구
app.get('/news/daegu', (req, res) => {
    res.sendFile(__dirname + '/news/daegu.html');
});


//경북
app.get('/news/gyeongsangbuk', (req, res) => {
    res.sendFile(__dirname + '/news/gyeongsangbuk.html');
});


//광주
app.get('/news/gwangju', (req, res) => {
    res.sendFile(__dirname + '/news/gwangju.html');
});


//전남
app.get('/news/jellanam', (req, res) => {
    res.sendFile(__dirname + '/news/jellanam.html');
});


//전북
app.get('/news/jeollabuk', (req, res) => {
    res.sendFile(__dirname + '/news/jeollabuk.html');
});


//대전
app.get('/news/daejeon', (req, res) => {
    res.sendFile(__dirname + '/news/daejeon.html');
});

//충남
app.get('/news/chungcheongnam', (req, res) => {
    res.sendFile(__dirname + '/news/chungcheongnam.html');
});

//세종
app.get('/news/sejong', (req, res) => {
    res.sendFile(__dirname + '/news/sejong.html');
});

//충북
app.get('/news/chungcheongbuk', (req, res) => {
    res.sendFile(__dirname + '/news/chungcheongbuk.html');
});

//강원
app.get('/news/gangwon', (req, res) => {
    res.sendFile(__dirname + '/news/gangwon.html');
});

//제주
app.get('/news/jeju', (req, res) => {
    res.sendFile(__dirname + '/news/jeju.html');
});

///////////////////////////////////////////////////////

app.get('/board', (req, res) => {
    res.sendFile(__dirname + '/board.html');
});

app.get('/write', (req, res) => {
    res.sendFile(__dirname + '/write.html');
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/introduce.html');
});

app.get('/graph', (req, res) => {
    res.sendFile(__dirname + '/graph.html');
});

////****** 테스트 페이지*******////
app.get('/test', (req, res) => {
    res.sendFile(__dirname + '/test.html');
});

app.get('/box', (req, res) => {
    res.sendFile(__dirname + '/box.html');
});


var mysql = require('mysql');
var connection = mysql.createConnection({
    host: '34.146.81.27',
    user: 'ubuntu',
    password: 'zmffhqk',
    database: 'Crime',
    dateStrings: 'date'
});

connection.connect();

// 좌표 데이터를 바탕으로 전국 '도' 범죄데이터를 받아온다.
io.on('connection', (socket) => {
    socket.on('send', (msg) => {
        var location = msg.split(',');
        connection.query('SELECT 살인, 강도, 성범죄, 절도, 폭력 FROM Crime.crime_CTPRVN where ( X = \"' + location[0] + '\" and Y = \"' + location[1] + '\")', (error, rows, fields) => {
            if (error) throw error;
            io.to(socket.id).emit('response', rows);
        });
    });
});


// 좌표 데이터를 바탕으로'구'의 범죄데이터를 받아온다.
io.on('connection', (socket) => {
    socket.on('send_seoul', (msg) => {
        var location = msg.split(',');
        connection.query('SELECT 살인, 강도, 성범죄, 절도, 폭력 FROM Crime.crime_SIG where ( X = \"' + location[0] + '\" and Y = \"' + location[1] + '\")', (error, rows, fields) => {
            if (error) throw error;
            io.to(socket.id).emit('response', rows);
        });
    });
});



// '도' 지역명, 좌표 데이터를 받아온다.
io.on('connection', (socket) => {
    socket.on('request_Nationwide_data', (msg) => {
        connection.query('select B.CTP_KOR_NM, A.X, A.Y from Crime.crime_CTPRVN A, Crime.map_CTPRVN B where A.CD = B.CTPRVN_CD;', (error, rows, fields) => {
            if (error) throw error;
            io.to(socket.id).emit('Nationwide_data', rows);
        });
    });
});


// 서울의 '구' 지역명, 좌표 데이터를 받아온다.
io.on('connection', (socket) => {
    socket.on('request_Seoul_data', (msg) => {
        connection.query('SELECT 지역, X, Y FROM Crime.crime_SIG; ', (error, rows, fields) => {
            if (error) throw error;
            io.to(socket.id).emit('Seoul_data', rows);
        });
    });
});



// 뉴스 데이터를 받아온다.
io.on('connection', (socket) => {
    socket.on('request_news', (msg) => {
        connection.query('select url, title, body, reporting_date, img from Crime.news order by reporting_date desc limit 8;', (error, rows, fields) => {
            if (error) throw error;
            io.to(socket.id).emit('news_data', rows);
        });
    });
});



/*****뉴스 테스트********/
// 뉴스 데이터를 받아온다.
io.on('connection', (socket) => {
    socket.on('request_news_r', (msg) => {
        connection.query('SELECT * FROM Crime.news where (select left (CD,2)) = (select CTPRVN_CD from Crime.map_CTPRVN where CTP_ENG_NM Like (select concat ( \"'+ msg + '\", "%")));', (error, rows, fields) => {
            if (error) throw error;
            io.to(socket.id).emit('news_data_r', rows);
        });
    });
});







// 쿼리 질의를 처리한다.
io.on('connection', (socket) => {
    socket.on('request_sql', (msg) => {
        console.log(msg);
        connection.query(msg, (error, rows, fields) => {
            if (error) throw error;
            io.to(socket.id).emit('sql_data', rows);
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