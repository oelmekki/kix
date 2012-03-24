(function() {
  var board, server;

  require('mootools');

  global.configuration = require('../configuration').configuration;

  server = new require('./Server.js').Server;

  board = new require('./Board.js').Board;

  server.addEvent('join', board.addPlayer.bind(board));

  server.addEvent('message', board.gotMessage.bind(board));

  server.addEvent('quit', board.removePlayer.bind(board));

  board.addEvent('change', server.sendJson.bind(server));

  board.addEvent('full', server.reject.bind(server));

}).call(this);
