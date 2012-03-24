(function() {
  var crypto;

  crypto = require('crypto');

  exports.Server = new Class({
    Implements: Events,
    initialize: function() {
      this.http = require('http');
      this.WebsocketServer = require('websocket').server;
      this.connections = {};
      this.createHttpServer();
      this.createWebsocketServer();
      return this;
    },
    createHttpServer: function() {
      this.http_server = this.http.createServer(function(req, resp) {
        console.log('received request for : ' + req.url);
        resp.writeHead(404);
        return resp.end();
      });
      return this.http_server.listen(3000, function() {
        return console.log('starting server');
      });
    },
    createWebsocketServer: function() {
      this.wsServer = new this.WebsocketServer({
        httpServer: this.http_server,
        autoAcceptConnections: false
      });
      return this.wsServer.on('request', this.requested.bind(this));
    },
    originIsAllowed: function(origin) {
      return origin.match(new RegExp(configuration.host));
    },
    reject: function(id) {
      this.connections[id].end('no more room');
      return delete this.connections[id];
    },
    sendJson: function(message) {
      return Object.each(this.connections, function(connection) {
        return connection.sendUTF(JSON.stringify(message));
      });
    },
    requested: function(request) {
      var connection, id;
      if (!this.originIsAllowed(request.origin)) {
        request.reject();
        return console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      } else {
        id = crypto.createHash('sha1').update(String.uniqueID()).digest('hex');
        connection = request.accept('square-play', request.origin);
        this.connections[id] = connection;
        connection.sendUTF(JSON.stringify({
          id: id
        }));
        console.log((new Date()) + ' Connection accepted.');
        this.handleMessage(connection, id);
        this.handleClose(connection, id);
        return this.fireEvent('join', id);
      }
    },
    handleMessage: function(connection, id) {
      var _this = this;
      return connection.on('message', function(message) {
        if (message.type === 'utf8') {
          return _this.fireEvent('message', [JSON.parse(message.utf8Data)]);
        }
      });
    },
    handleClose: function(connection, id) {
      var _this = this;
      return connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
        delete _this.connections[id];
        return _this.fireEvent('quit', id);
      });
    }
  });

}).call(this);
