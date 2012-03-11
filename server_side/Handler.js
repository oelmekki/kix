exports.Handler = new Class({ 
  Implements: Events,


  initialize: function( config ){
    this.players  = {};
    this.config   = config;
    this.step     = config.step;
    this.run_step = config.run_step;

    setInterval( this.move.bind( this ), config.base_beat );
  },


  gotMessage: function( message ){
    switch( message.action ){
      case 'change_direction':
        this.changeDirection( message.id, message.params );
        break;
    }
  },


  addPlayer: function( id ){
    var i, player, starting_edge;

    player = Object.clone( this.config.initial );

    // try to find a position for new player
    for ( i = 0; i < 100; i++ ){
      starting_edge = Number.random( 1, 4 );

      // top or bottom
      if ( [ 1, 2 ].indexOf( starting_edge ) !== -1 ){
         player.x = Number.random( 0, this.config.area_width );
         player.y = ( starting_edge == 1 ? 0 : this.config.area_height );
      }

      // left or right
      else {
         player.y = Number.random( 0, this.config.area_height );
         player.x = ( starting_edge == 3 ? 0 : this.config.area_width );
      }

      if ( this.noCollision( id, player ) ){
        player.color        = 'rgb( ' + Number.random( 10, 255 )  + ', ' + Number.random( 10, 255 ) + ', ' + Number.random( 10, 255 ) + ' )';
        this.players[ id ]  = player;

        this.change();
        break;
      }

      else if ( i == 99 ){
        this.fireEvent( 'full', id );
      }
    }
  },


  removePlayer: function( id ){
    delete this.players[ id ];
    this.change();
  },


  changeDirection: function( id, options ){
    if ( this.players[ id ] && [ 'up', 'right', 'down', 'left' ].indexOf( options.direction ) != -1 ){
      this.players[ id ].direction = options.direction;
      this.players[ id ].run       = !! options.run;
    }
  },


  move: function(){
    Object.each( this.players, function( player, id ){
      var new_position, step, change = true;

      step = player.run ? this.run_step : this.step;

      new_position = {
        x: player.x,
        y: player.y,
        width: player.width,
        height: player.height
      };

      switch ( player.direction ){
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

      if ( change && this.noCollision( id, new_position ) ){
        this.fixPosition( new_position );

        if ( this.legalMove( new_position ) ){
          player.x = new_position.x;
          player.y = new_position.y;
        }

      }
    }.bind( this ));

    this.change();
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


  legalMove: function( new_position ){
    if ( new_position.y == 0 && new_position.x >= 0 && new_position.x <= this.config.area_width ){
      return true;
    }

    if ( new_position.y == this.config.area_height && new_position.x >= 0 && new_position.x <= this.config.area_width ){
      return true;
    }

    if ( new_position.x == 0 && new_position.y >= 0 && new_position.y <= this.config.area_height ){
      return true;
    }

    if ( new_position.x == this.config.area_width && new_position.y >= 0 && new_position.y <= this.config.area_height ){
      return true;
    }

    return false;
  }.protect(),


  fixPosition: function( new_position ){
    if ( new_position.x < 0 ){
      new_position.x = 0;
    }

    if ( new_position.x > this.config.area_width ){
      new_position.x = this.config.area_width;
    }

    if ( new_position.y < 0 ){
      new_position.y = 0;
    }

    if ( new_position.y > this.config.area_height ){
      new_position.y = this.config.area_height;
    }
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
  }.protect()
});
