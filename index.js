var contents;
var contents_c;
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

//app.get('/news', (req, res) => {
//    res.sendFile(__dirname + '/news.html');
//});


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

app.get('/con', (req, res) => {
    res.sendFile(__dirname + '/contents.html');
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/introduce.html');
});

app.get('/graph', (req, res) => {
    res.sendFile(__dirname + '/graph.html');
});

app.get('/change', (req, res) => {
    res.sendFile(__dirname + '/change.html');
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
    host: 'localhost',
    user: 'root',
    password: '@zmffhqk',
    database: 'Crime',
    dateStrings: 'date'
});

connection.connect();



io.on('connection', (socket) => {
    // 좌표 데이터를 바탕으로 전국 '도' 범죄데이터를 받아온다.
    socket.on('send', (msg) => {
        var location = msg.split(',');
        connection.query('SELECT 살인, 강도, 성범죄, 절도, 폭력 FROM Crime.crime_CTPRVN where ( X = \"' + location[0] + '\" and Y = \"' + location[1] + '\")', (error, rows, fields) => {
            if (error) throw error;
            io.to(socket.id).emit('response', rows);
        });
    });


    // 좌표 데이터를 바탕으로'구'의 범죄데이터를 받아온다.
    socket.on('send_seoul', (msg) => {
        var location = msg.split(',');
        connection.query('SELECT 살인, 강도, 성범죄, 절도, 폭력 FROM Crime.crime_SIG where ( X = \"' + location[0] + '\" and Y = \"' + location[1] + '\")', (error, rows, fields) => {
            if (error) throw error;
            io.to(socket.id).emit('response', rows);
        });
    });


    // '도' 지역명, 좌표 데이터를 받아온다.
    socket.on('request_Nationwide_data', (msg) => {
        connection.query('select B.CTP_KOR_NM, A.X, A.Y from Crime.crime_CTPRVN A, Crime.map_CTPRVN B where A.CD = B.CTPRVN_CD;', (error, rows, fields) => {
            if (error) throw error;
            io.to(socket.id).emit('Nationwide_data', rows);
        });
    });


    // 서울의 '구' 지역명, 좌표 데이터를 받아온다.
    socket.on('request_Seoul_data', (msg) => {
        connection.query('SELECT 지역, X, Y FROM Crime.crime_SIG; ', (error, rows, fields) => {
            if (error) throw error;
            io.to(socket.id).emit('Seoul_data', rows);
        });
    });



    // 뉴스 데이터를 받아온다.
    socket.on('request_news_r', (msg) => {
        connection.query('SELECT * FROM Crime.news where (select left (CD,2)) = (select CTPRVN_CD from Crime.map_CTPRVN where CTP_ENG_NM Like (select concat ( \"' + msg + '\", "%")));', (error, rows, fields) => {
            if (error) throw error;
            io.to(socket.id).emit('news_data_r', rows);
        });
    });



    // 게시글의 개수를 받아온다.
    socket.on('request_board_size', (msg) => {
        connection.query('SELECT count(num) from board;', (error, rows, fields) => {
            if (error) throw error;
            io.to(socket.id).emit('board_size', rows);
        });
    });


    //게시글을 받아온다.
    socket.on('request_board_data', (msg) => {
        connection.query('select * from board;', (error, rows, fields) => {
            if (error) throw error;
            //console.log(rows);
            io.to(socket.id).emit('board_data', rows);
        });
    });


    // 게시글 내용 저장
    socket.on('contents_save', (msg) => {
        contents = msg;
        //console.log(contents);
    });


    // 게시글 내용 보내기
    socket.on('contents_request', (msg) => {
        io.to(socket.id).emit('contents', contents);
        contents = null;
    });


    // 게시글 수정 내용 저장
    socket.on('contents_save_c', (msg) => {
        contents_c = msg;
        //console.log(contents);
    });


    // 게시글 수정 내용 보내기
    socket.on('contents_request_c', (msg) => {
        io.to(socket.id).emit('contents_c', contents_c);
        contents_c = null;
    });


    // insert 쿼리 질의
    socket.on('insert_sql', (msg) => {
        connection.query(msg, (error, rows, fields) => {
            if (error) throw error;
        });
    });


    // update 쿼리 질의
    socket.on('update_sql', (msg) => {
        connection.query(msg, (error, rows, fields) => {
            if (error) throw error;
            if (rows['affectedRows'] == 0)
                io.to(socket.id).emit('pw_error_c', 0);   // 비밀번호가 틀립

            else
                io.to(socket.id).emit('pw_error_c', 1);   // 비밀번호가 맞음

        });
    });



    // delete 쿼리 질의
    socket.on('delete_sql', (msg) => {
        connection.query(msg, (error, rows, fields) => {
            if (error) throw error;
            if (rows['affectedRows'] == 0)
                io.to(socket.id).emit('pw_error_d', 0);   // 비밀번호가 틀립

            else
                io.to(socket.id).emit('pw_error_d', 1);   // 비밀번호가 맞음

        });
    });


    // 그래프 데이터 가져오기
    socket.on('request_graph', (msg) => {
        connection.query('select sum(살인), sum(강도), sum(성범죄), sum(절도), sum(폭력) from crime_CTPRVN;', (error, rows, fields) => {
            if (error) throw error;
            console.log(rows);
            io.to(socket.id).emit('graph', rows);
        });
    });





    // 출력 테스트용
    socket.on('msg_00', (msg) => {
        console.log(msg);
    });


});



server.listen(3000, () => {
    console.log('listening on *:3000');
});

//connection.end()