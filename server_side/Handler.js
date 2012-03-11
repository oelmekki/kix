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
    }
  },


  addPlayer: function( id ){
    var i, player;

    player = Object.clone( this.options.initial );

    for ( i = 0; i < 100; i++ ){
      player.x = Number.random( 0, this.config.area_width - player.width );
      player.y = Number.random( 0, this.config.area_height - player.height );

      if ( this.noCollision( id, player ) ){
        break;
      }

      else if ( i == 99 ){
        this.fireEvent( 'full', id );
      }
    }

    player.color        = 'rgba( ' + Number.random( 10, 255 )  + ', ' + Number.random( 10, 255 ) + ', ' + Number.random( 10, 255 ) + ', 0.8 )';
    this.players[ id ]  = player;

    this.change();
  },


  removePlayer: function( id ){
    delete this.players[ id ];
    this.change();
  },


  move: function( id, options ){
    var new_position, change = true;

    if ( ! options.step ){
      options.step = this.options.step;
    }

    new_position = {
      x: this.players[ id ].x,
      y: this.players[ id ].y,
      width: this.players[ id ].width,
      height: this.players[ id ].height
    };

    switch ( options.direction ){
      case 'up':
        new_position.y -= options.step;
        break;

      case 'right':
        new_position.x += options.step;
        break;

      case 'down':
        new_position.y += options.step;
        break;

      case 'left':
        new_position.x -= options.step;
        break;

      default:
        change = false;
    }

    if ( change && this.noCollision( id, new_position ) ){
      this.players[ id ].x = new_position.x;
      this.players[ id ].y = new_position.y;
      this.change();
    }
  },


  // Protected


  change: function(){
    this.fireEvent( 'change', [ Object.values( this.players ) ] );
  }.protect(),


  noCollision: function( current_id, new_position ){
    var collide = false;

    Object.each( this.players, function( player, player_id ){
      if ( player_id != current_id ){
        if ( this.collide( new_position, player ) ){
          collide = true;
        }
      }
    }.bind( this ));

    return ! collide;
  }.protect(),


  collide: function( current, other ){
    if ( ! (current.x + current.width >= other.x ) ){
      return false;
    }

    if ( ! ( current.x <= other.x + other.width ) ){
      return false;
    }

    if ( ! ( current.y - current.height <= other.y ) ){
      return false;
    }

    if ( ! ( current.y >= other.y - other.height ) ){
      return false;
    }

    return true;
  }
});
