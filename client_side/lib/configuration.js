(function() {

  (function(glob) {
    return glob.configuration = {
      host: 'localhost',
      port: 3000,
      area_width: 800,
      area_height: 400,
      step: 2,
      run_step: 5,
      base_beat: 25,
      initial: {
        width: 6,
        height: 6,
        direction: null,
        run: false
      }
    };
  })(typeof exports !== 'undefined' ? exports : window);

}).call(this);
