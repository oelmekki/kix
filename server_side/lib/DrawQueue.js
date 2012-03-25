(function() {

  exports.DrawQueue = new Class({
    initialize: function() {
      this.queue = [];
      return this;
    },
    addPosition: function(new_position) {
      this.queue.push(new_position);
      return this.simplify();
    },
    reset: function() {
      return this.queue = [];
    },
    simplify: (function() {
      var positions, start_index;
      if (this.queue.length > 2) {
        start_index = this.queue.length - 3;
        positions = this.queue.slice(start_index, start_index + 3);
        if (positions.length > 2) {
          if ((positions[2].x === positions[1].x && positions[2].x === positions[0].x) || (positions[2].y === positions[1].y && positions[2].y === positions[0].y)) {
            return this.queue.splice(start_index, 3, positions[0], positions[2]);
          }
        }
      }
    }).protect()
  });

}).call(this);
