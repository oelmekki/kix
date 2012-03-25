(function() {

  exports.Base = new Class({
    Implements: [Options, Events],
    options: {
      dependencies: {}
    },
    initialize: function(options) {
      var name, object, _ref;
      this.setOptions(options);
      _ref = this.options.dependencies;
      for (name in _ref) {
        object = _ref[name];
        this[name] = object;
      }
      return this;
    }
  });

}).call(this);
