(function() {

  window.EventHandler = new Class({
    Implements: Events,
    initialize: function() {
      var WebSock;
      WebSock = typeof MozWebSocket !== 'undefined' ? MozWebSocket : WebSocket;
      this.sock = new WebSock('ws://' + configuration.host + ':' + configuration.port, 'square-play');
      window.addEvent('keydown', this.keyDowned.bind(this));
      window.addEvent('resize', this.windowResized.bind(this));
      this.sock.onopen = this.connected.bind(this);
      this.sock.onmessage = this.gotMessage.bind(this);
      this.sock.onerror = this.error.bind(this);
      return this;
    },
    keyDowned: function(event) {
      var data;
      if (['up', 'right', 'down', 'left'].indexOf(event.key) !== -1) {
        event.preventDefault();
        data = {
          id: this.id,
          action: 'change_direction',
          params: {
            direction: event.key,
            run: event.shift,
            draw: event.control
          }
        };
        return this.sock.send(JSON.encode(data));
      }
    },
    connected: function() {
      console.log('socket open');
      return this.sock.send(JSON.encode({
        action: 'init'
      }));
    },
    gotMessage: function(event) {
      var data;
      data = JSON.decode(event.data);
      if (data.id) {
        return this.id = data.id;
      } else {
        return this.fireEvent('change', [data]);
      }
    },
    error: function() {
      return alert('got error');
    },
    windowResized: function() {
      return this.fireEvent('viewport_change');
    }
  });

}).call(this);
