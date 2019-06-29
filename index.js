var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var { parse } = require('querystring');
var users = []
var username = 'Usuario'
var id

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/config', function(req, res){
  res.send('<!doctype html>' +
  '<html> ' +
    '<head> ' +
      '<meta charset="UTF-8"> ' +
      '<title>Chat web</title> ' +
      '<style> ' +
        '* { margin: 0; padding: 0; box-sizing: border-box; } ' +
        'body { font: 13px Helvetica, Arial; } ' +
        '#ali{ ' +
          'float: right; ' +
          'padding: .3em; ' +
          'display: block; ' +
          'text-decoration: none; ' +
          'color: #333; ' +
          'background: #F4F4F4; ' +
          'border-top: 1px solid #7C7C7C; ' +
          'border-right: 1px solid #7C7C7C; ' +
          'border-bottom: 1px solid #9C9C9C; ' +
        '} ' +
      '</style> ' +
    '</head> ' +
    '<body> ' +
      '<ul> ' +
        '<li><a id="ali" href="/">Sala</a></li> ' +
      '</ul> ' +
      '<a value=' + id + ' id="id"> ' +
      '<a value=' + username +' id="username"> ' +
      '<form action="/" method="post"> ' +
        '<h3 class="title">Cual es tu nombre?</h3> ' +
        '<input type="text" name="user" /><button>Guardar</button> ' +
      '</form> ' +
      '<script src="https://code.jquery.com/jquery-1.11.1.js"></script> ' +
    '</body> ' +
  '</html>');
});

app.post('/', function(req, res){
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  req.on('end', () => {
    var found = false
    for(var i = 0; i < users.length; i++){
      if (id == users[i].id)
        users[i].username = parse(body).user;
    }
    res.sendFile(__dirname + '/index.html');
  });
});

io.on('connection', function(socket){
  var found = false
  for(var i = 0; i < users.length; i++){
    if (username == users[i].username)
      found = true
  }
  if (found == false){
    id = Math.floor(Math.random() * (1000))
    users.push({username: username, id: id});
    //console.log(users);
  }
  socket.on('chat message', function(msg){
    console.log(username, id);
    io.emit('chat message', username + ": " + msg);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
