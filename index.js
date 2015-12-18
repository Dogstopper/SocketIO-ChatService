var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
  var nickname = 'anon';

  socket.broadcast.emit('chat message', { 'nick': 'Server Bot', 'text': nickname + ' has connected'});

  socket.on('nickname', function(nick) {
    var oldNick = nickname;
    nickname = nick;
    socket.broadcast.emit('chat message', { 'nick': 'Server Bot', 'text': oldNick + ' has changed name to ' + nickname});
  });

  socket.on('disconnect', function() {
    socket.broadcast.emit('chat message', { 'nick': 'Server Bot', 'text': nickname + ' has disconnected'});
  });

  socket.on('chat message', function(msg) {
    socket.broadcast.emit('chat message', { 'nick': nickname, 'text': msg});
  })
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
