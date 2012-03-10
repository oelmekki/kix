exports.Handler = new Class({ 
  Implements: [ Options, Events ],

  options: {
    x: 30,
    y: 30,
    initial: {
      width: 50,
      height: 55,
      step: 1
    }
  },


  initialize: function( config ){
    this.setOptions();
    this.players  = {};
    this.config   = config;
  },


  gotMessage: function( message ){
    switch( message.action ){
      case 'move':
        this.move( message.id, message.params );
        break;

      case 'resize':
        this.resize( message.id, message.params );
        break;
    }
  },


  addPlayer: function( id ){
    var player          = Object.clone( this.options.initial );
    player.x            = Number.random( 0, this.config.area_width - player.width );
    player.y            = Number.random( 0, this.config.area_height - player.height );
    player.color        = 'rgba( ' + Number.random( 10, 255 )  + ', ' + Number.random( 10, 255 ) + ', ' + Number.random( 10, 255 ) + ', 0.8 )';
    this.players[ id ]  = player;

    this.change();
  },


  removePlayer: function( id ){
    delete this.players[ id ];
    this.change();
  },


  change: function(){
    this.fireEvent( 'change', [ Object.values( this.players ) ] );
  },


  move: function( id, options ){
    var change = true;

    if ( ! options.step ){
      options.step = this.options.step;
    }

    switch ( options.direction ){
      case 'up':
        this.players[ id ].y -= options.step;
        break;

      case 'right':
        this.players[ id ].x += options.step;
        break;

      case 'down':
        this.players[ id ].y += options.step;
        break;

      case 'left':
        this.players[ id ].x -= options.step;
        break;

      default:
        change = false;
    }

    if ( change ){
      this.change();
    }
  },


  resize: function( id, options ){
    var change = true;

    if ( ! options.step ){
      options.step = this.options.step;
    }

    switch ( options.direction ){
      case 'up':
        this.players[ id ].height -= options.step;
        break;

      case 'right':
        this.players[ id ].width += options.step;
        break;

      case 'down':
        this.players[ id ].height += options.step;
        break;

      case 'left':
        this.players[ id ].width -= options.step;
        break;

      default:
        change = false;
    }

    if ( change ){
      this.change();
    }
  }
});
