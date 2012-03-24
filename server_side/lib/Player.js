(function() {
  var __hasProp = Object.prototype.hasOwnProperty;

  exports.Player = new Class({
    initialize: function() {
      var attr, value, _ref;
      this.step = configuration.step;
      this.run_step = configuration.run_step;
      _ref = configuration.initial;
      for (attr in _ref) {
        if (!__hasProp.call(_ref, attr)) continue;
        value = _ref[attr];
        this[attr] = value;
      }
      return this;
    },
    positionateRandom: function() {
      var starting_edge;
      starting_edge = Number.random(1, 4);
      if ([1, 2].indexOf(starting_edge) !== -1) {
        this.x = Number.random(0, configuration.area_width);
        return this.y = starting_edge === 1 ? 0 : configuration.area_height;
      } else {
        this.y = Number.random(0, configuration.area_height);
        return this.x = starting_edge === 3 ? 0 : configuration.area_width;
      }
    },
    create: function() {
      this.color = 'rgb( ' + Number.random(10, 255) + ', ' + Number.random(10, 255) + ', ' + Number.random(10, 255) + ' )';
      return this.drawn = [
        {
          x: this.x,
          y: this.y
        }
      ];
    },
    findNewPosition: function() {
      var new_position, step;
      step = this.run ? this.run_step : this.step;
      new_position = {
        x: this.x,
        y: this.y,
        width: this.width,
        height: this.height
      };
      switch (this.direction) {
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
      }
      return new_position;
    },
    move: function(new_position) {
      this.fixPosition(new_position);
      if (this.isOnSafeZone(new_position)) {
        this.x = new_position.x;
        return this.y = new_position.y;
      } else if (this.drawing) {
        this.drawn.push({
          x: new_position.x,
          y: new_position.y
        });
        this.x = new_position.x;
        return this.y = new_position.y;
      }
    },
    changeDirection: function(options) {
      if (['up', 'right', 'down', 'left'].indexOf(options.direction) !== -1) {
        this.direction = options.direction;
        this.run = !!options.run;
        if (options.draw) {
          if (!this.draw && this.isOnSafeZone(this)) {
            this.drawn = [];
            return this.drawing = true;
          }
        }
      }
    },
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
    }).protect()
  });

}).call(this);
