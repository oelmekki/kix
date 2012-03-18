(function() {

  exports.Board = new Class({
    Implements: Events,
    initialize: function(run) {
      if (run == null) run = true;
      this.players = {};
      this.step = configuration.step;
      this.run_step = configuration.run_step;
      if (run) setInterval(this.move.bind(this), configuration.base_beat);
      return this;
    },
    gotMessage: function(message) {
      switch (message.action) {
        case 'change_direction':
          return this.changeDirection(message.id, message.params);
      }
    },
    addPlayer: function(id) {
      var i, player, starting_edge, _ref, _ref2, _results;
      player = Object.clone(configuration.initial);
      _results = [];
      for (i = 0; i <= 99; i++) {
        starting_edge = Number.random(1, 4);
        if ([1, 2].indexOf(starting_edge) !== -1) {
          player.x = Number.random(0, configuration.area_width);
          player.y = (_ref = starting_edge === 1) != null ? _ref : {
            0: configuration.area_height
          };
        } else {
          player.y = Number.random(0, configuration.area_height);
          player.x = (_ref2 = starting_edge === 3) != null ? _ref2 : {
            0: configuration.area_width
          };
        }
        if (this.noCollision(id, player)) {
          player.color = 'rgb( ' + Number.random(10, 255) + ', ' + Number.random(10, 255) + ', ' + Number.random(10, 255) + ' )';
          player.drawn = [
            {
              x: player.x,
              y: player.y
            }
          ];
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
    changeDirection: function(id, options) {
      if (this.players[id] && ['up', 'right', 'down', 'left'].indexOf(options.direction) !== -1) {
        this.players[id].direction = options.direction;
        this.players[id].run = !!options.run;
        if (options.draw) {
          if (!this.players[id].draw && this.isOnSafeZone(this.players[id])) {
            this.players[id].drawn = [];
            return this.players[id].drawing = true;
          }
        }
      }
    },
    move: function() {
      var _this = this;
      Object.each(this.players, function(player, id) {
        var change, new_position, step;
        change = true;
        step = player.run ? _this.run_step : _this.step;
        new_position = {
          x: player.x,
          y: player.y,
          width: player.width,
          height: player.height
        };
        switch (player.direction) {
          case 'up':
            new_position.y -= step;
            break;
          case 'right':
            new_position.x += step;
            break;
          case 'down':
            new_position.y += step;
            break;
          case 'left':
            new_position.x -= step;
            break;
          default:
            change = false;
        }
        if (change && _this.noCollision(id, new_position)) {
          _this.fixPosition(new_position);
          if (_this.isOnSafeZone(new_position)) {
            player.x = new_position.x;
            return player.y = new_position.y;
          } else if (player.drawing) {
            player.drawn.push({
              x: new_position.x,
              y: new_position.y
            });
            player.x = new_position.x;
            return player.y = new_position.y;
          }
        }
      });
      return this.change();
    },
    change: (function() {
      return this.fireEvent('change', [Object.values(this.players)]);
    }).protect(),
    noCollision: (function(current_id, new_position) {
      var collide,
        _this = this;
      collide = false;
      Object.each(this.players, function(player, player_id) {
        if (player_id !== current_id) {
          if (_this.collide(new_position, player)) return collide = true;
        }
      });
      return !collide;
    }).protect(),
    isOnSafeZone: (function(position) {
      if (position.y === 0 && position.x >= 0 && position.x <= configuration.area_width) {
        return true;
      }
      if (position.y === configuration.area_height && position.x >= 0 && position.x <= configuration.area_width) {
        return true;
      }
      if (position.x === 0 && position.y >= 0 && position.y <= configuration.area_height) {
        return true;
      }
      if (position.x === configuration.area_width && position.y >= 0 && position.y <= configuration.area_height) {
        return true;
      }
      return false;
    }).protect(),
    fixPosition: (function(new_position) {
      if (new_position.x < 0) new_position.x = 0;
      if (new_position.x > configuration.area_width) {
        new_position.x = configuration.area_width;
      }
      if (new_position.y < 0) new_position.y = 0;
      if (new_position.y > configuration.area_height) {
        return new_position.y = configuration.area_height;
      }
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
