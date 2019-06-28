var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var { parse } = require('querystring');
var username = 'Usuario'

var mysql = require("mysql");
var pool = mysql.createPool({
host     : 'host',
user     : 'user',
database : 'db_name',
connectionLimit: 1000
});

exports.pool = pool;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/config', function(req, res){
  res.sendFile(__dirname + '/config.html');
});

app.post('/', function(req, res){
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  req.on('end', () => {
    username = parse(body).user;
    res.sendFile(__dirname + '/index.html');
  });
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', username + ": " + msg);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
