(function() {
  var Player;

  Player = require('./Player').Player;

  exports.Board = new Class({
    Implements: Events,
    initialize: function(run) {
      if (run == null) run = true;
      this.players = {};
      if (run) setInterval(this.move.bind(this), configuration.base_beat);
      return this;
    },
    gotMessage: function(message) {
      switch (message.action) {
        case 'change_direction':
          if (this.players[message.id]) {
            return this.players[message.id].changeDirection(message.params);
          }
      }
    },
    addPlayer: function(id) {
      var i, player, _results;
      player = new Player();
      _results = [];
      for (i = 0; i <= 99; i++) {
        player.positionateRandom();
        if (this.noCollision(id, player)) {
          player.create();
          this.players[id] = player;
          this.change();
          break;
        } else if (i === 99) {
          _results.push(this.fireEvent('full', id));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    },
    removePlayer: function(id) {
      delete this.players[id];
      return this.change();
    },
    move: function() {
      var _this = this;
      Object.each(this.players, function(player, id) {
        var new_position;
        new_position = player.findNewPosition();
        if (_this.noCollision(id, new_position)) return player.move(new_position);
      });
      return this.change();
    },
    change: (function() {
      return this.fireEvent('change', [Object.values(this.players)]);
    }).protect(),
    noCollision: (function(current_id, current_player) {
      var collide,
        _this = this;
      collide = false;
      Object.each(this.players, function(player, player_id) {
        if (player_id !== current_id) {
          if (_this.collide(current_player, player)) return collide = true;
        }
      });
      return !collide;
    }).protect(),
    collide: (function(current, other) {
      if (!(current.x + current.width >= other.x)) return false;
      if (!(current.x <= other.x + other.width)) return false;
      if (!(current.y - current.height <= other.y)) return false;
      if (!(current.y >= other.y - other.height)) return false;
      return true;
    }).protect()
  });

}).call(this);
