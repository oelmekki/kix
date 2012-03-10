exports.Handler = new Class({ 
  Implements: Events,

  options: {
    x: 30,
    y: 30,
    width: 50,
    height: 55,
    step: 1
  },


  initialize: function(){
    this.data = {
      x:      this.options.x,
      y:      this.options.y,
      width:  this.options.width,
      height: this.options.height
    };
  },


  gotMessage: function( message ){
    switch( message.action ){
      case 'move':
        this.move( message.params );
        break;

      case 'resize':
        this.resize( message.params );
        break;

      case 'init':
        this.fireEvent( 'change', [ this.data ] );
    }
  },


  move: function( options ){
    var change = true;

    if ( ! options.step ){
      options.step = this.options.step;
    }

    switch ( options.direction ){
      case 'up':
        this.data.y -= options.step;
        break;

      case 'right':
        this.data.x += options.step;
        break;

      case 'down':
        this.data.y += options.step;
        break;

      case 'left':
        this.data.x -= options.step;
        break;

      default:
        change = false;
    }

    if ( change ){
      this.fireEvent( 'change', [ this.data ] );
    }
  },


  resize: function( options ){
    var change = true;

    if ( ! options.step ){
      options.step = this.options.step;
    }

    switch ( options.direction ){
      case 'up':
        this.data.height -= options.step;
        break;

      case 'right':
        this.data.width += options.step;
        break;

      case 'down':
        this.data.height += options.step;
        break;

      case 'left':
        this.data.width -= options.step;
        break;

      default:
        change = false;
    }

    if ( change ){
      this.fireEvent( 'change', [ this.data ] );
    }
  }
});
