(function() {
  var __hasProp = Object.prototype.hasOwnProperty;

  exports.Player = new Class({
    Extends: require('./Base').Base,
    options: {
      dependencies: {
        DrawQueue: require('./DrawQueue').DrawQueue
      }
    },
    initialize: function(options) {
      var attr, value, _ref;
      this.parent(options);
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
      return this.draw_queue = new this.DrawQueue();
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
        this.y = new_position.y;
        if (this.drawing) {
          this.draw_queue.reset();
          return this.drawing = false;
        }
      } else if (this.drawing) {
        if (this.draw_queue.is_empty()) {
          this.draw_queue.addPosition({
            x: this.x,
            y: this.y
          });
        }
        this.draw_queue.addPosition({
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
        if (options.draw) return this.drawing = true;
      }
    },
    toJson: function() {
      var resp;
      return resp = {
        x: this.x,
        y: this.y,
        width: this.width,
        height: this.height,
        drawn: this.draw_queue.queue
      };
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
