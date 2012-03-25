(function() {

  window.Drawer = new Class({
    initialize: function() {
      this.$canvas = document.getElement('canvas');
      this.ctx = this.$canvas.getContext('2d');
      this.current_radius = 2;
      this.animation_factor = 1;
      this.players = [];
      this.running = true;
      this.synced = false;
      this.$canvas.set('width', configuration.area_width + (configuration.initial.width * 2));
      this.$canvas.set('height', configuration.area_height + (configuration.initial.height * 2));
      this.ctx.translate(configuration.initial.width, configuration.initial.height);
      this.positionateCanvas();
      window.setInterval(this.animate.bind(this), 125);
      window.setInterval(this.update.bind(this), configuration.base_beat);
      return this;
    },
    updateData: function(players) {
      this.players = players;
      return this.synced = true;
    },
    update: function() {
      var _this = this;
      if (this.running) {
        this.clear();
        this.drawBorder();
        Object.each(this.players, function(player) {
          return _this.drawPlayer(player);
        });
        return this.synced = false;
      }
    },
    positionateCanvas: function() {
      var viewport_size;
      viewport_size = window.getSize();
      return this.$canvas.setStyles({
        'left': (viewport_size.x - (configuration.area_width + configuration.initial.width)) / 2,
        'top': (viewport_size.y - (configuration.area_height + configuration.initial.height)) / 2
      });
    },
    pause: function() {
      return this.running = false;
    },
    unpause: function() {
      return this.running = true;
    },
    clear: (function() {
      return this.draw(function() {
        this.ctx.translate(-configuration.initial.width, -configuration.initial.height);
        return this.ctx.clearRect(0, 0, configuration.area_width + (configuration.initial.width * 2), configuration.area_height + (configuration.initial.height * 2));
      });
    }).protect(),
    animate: function() {
      if (this.running) {
        this.current_radius += 1 * this.animation_factor;
        if (this.current_radius >= 7) {
          this.current_radius = 6;
          this.animation_factor = -1;
        }
        if (this.current_radius <= 2) {
          this.current_radius = 3;
          return this.animation_factor = 1;
        }
      }
    },
    draw: (function(drawing_function, params) {
      this.ctx.save();
      drawing_function.call(this, params);
      return this.ctx.restore();
    }).protect(),
    drawPlayer: (function(player) {
      var _this = this;
      if (!this.synced) this.anticipate(player);
      return this.draw((function(player) {
        var path, start;
        _this.ctx.fillStyle = player.color;
        if (player.drawn.length) {
          path = Array.clone(player.drawn);
          start = path.shift();
          _this.ctx.strokeStyle = player.color;
          _this.ctx.beginPath();
          _this.ctx.moveTo(start.x, start.y);
          player.drawn.each(function(coord) {
            return _this.ctx.lineTo(coord.x, coord.y);
          });
          _this.ctx.stroke();
        }
        _this.ctx.beginPath();
        _this.ctx.arc(player.x, player.y, _this.current_radius, 0, Math.PI * 2, true);
        return _this.ctx.fill();
      }), player);
    }).protect(),
    anticipate: function(player) {
      var step;
      step = configuration[player.run ? 'run_step' : 'step'];
      switch (player.direction) {
        case 'top':
          if (player.y - step <= 0) return player.y -= step;
          break;
        case 'right':
          if (player.x + step <= configuration.area_width) return player.x += step;
          break;
        case 'bottom':
          if (player.y + step <= configuration.area_height) {
            return player.y += step;
          }
          break;
        case 'left':
          if (player.x - step >= 0) return player.x -= step;
      }
    },
    drawBorder: (function() {
      var _this = this;
      return this.draw(function() {
        _this.ctx.strokeStyle = '#888';
        _this.ctx.lineWidth = 1;
        return _this.ctx.strokeRect(0, 0, configuration.area_width, configuration.area_height);
      });
    }).protect()
  });

}).call(this);
