var Drawer = new Class({ 
  initialize: function(){
    this.$canvas          = document.getElement( 'canvas' );
    this.ctx              = this.$canvas.getContext( '2d' );
    this.current_radius   = 2;
    this.animation_factor = 1;
    this.players          = [];
    this.running          = true;
    this.synced           = false;

    this.$canvas.set( 'width', configuration.area_width + ( configuration.initial.width * 2 ) );
    this.$canvas.set( 'height', configuration.area_height + ( configuration.initial.height * 2 ) );
    this.ctx.translate( configuration.initial.width, configuration.initial.height );
    this.positionateCanvas();

    window.setInterval( this.animate.bind( this ), 125 );
    window.setInterval( this.update.bind( this ), configuration.base_beat );
  },


  updateData: function( players ){
    this.players = players;
    this.synced  = true;
  },


  update: function(){
    if ( this.running ){
      this.clear();
      this.drawBorder();
      Object.each( this.players, function( player ){
        this.drawPlayer( player );
      }.bind( this ));
      this.synced = false;
    }
  },
  

  positionateCanvas: function(){
    var viewport_size = window.getSize();
    this.$canvas.setStyles({ 
      'left': ( viewport_size.x - ( configuration.area_width + configuration.initial.width ) ) / 2,
      'top': ( viewport_size.y - ( configuration.area_height + configuration.initial.height ) ) / 2
    });
  },


  pause: function(){
    this.running = false;
  },


  unpause: function(){
    this.running = true;
  },


  // Protected


  clear: function(){
    this.draw( function(){
      this.ctx.translate( - configuration.initial.width, - configuration.initial.height );
      this.ctx.clearRect( 0, 0, configuration.area_width + ( configuration.initial.width * 2 ), configuration.area_height + ( configuration.initial.height * 2 ) );
    });
  }.protect(),


  animate: function(){
    if ( this.running ){
      this.current_radius += 1 * this.animation_factor;

      if ( this.current_radius >= 7 ){
        this.current_radius   = 6;
        this.animation_factor = -1;
      }

      if ( this.current_radius <= 2 ){
        this.current_radius   = 3;
        this.animation_factor = 1;
      }
    }
  },
  

  draw: function( drawing_function, params ){
    this.ctx.save();
    drawing_function.call( this, params );
    this.ctx.restore();
  }.protect(),


  drawPlayer: function( player ){
    var start, path;

    if ( ! this.synced ){
      this.anticipate( player );
    }

    this.draw( function( player ){
      this.ctx.fillStyle = player.color;

      if ( player.drawn.length ){
        path                  = Array.clone( player.drawn );
        start                 = path.shift();
        this.ctx.strokeStyle  = player.color;

        this.ctx.beginPath();
        this.ctx.moveTo( start.x, start.y );

        player.drawn.each( function( coord ){
          this.ctx.lineTo( coord.x, coord.y );
        }.bind( this ));

        this.ctx.stroke();
      }

      this.ctx.beginPath();
      this.ctx.arc( player.x, player.y, this.current_radius, 0, Math.PI * 2, true );
      this.ctx.fill();
    }, player );
  }.protect(),


  anticipate: function( player ){
    var step = configuration[ player.run ? 'run_step' : 'step' ];

    switch( player.direction ){
      case 'top':
        if ( player.y - step <= 0 ){
          player.y -= step;
        }
        break;

      case 'right':
        if ( player.x + step <= configuration.area_width ){
          player.x += step;
        }
        break;

      case 'bottom':
        if ( player.y + step <= configuration.area_height ){
          player.y += step;
        }
        break;

      case 'left':
        if ( player.x - step >= 0 ){
          player.x -= step;
        }
        break;
    }
  },


  drawBorder: function(){
    this.draw( function(){
      var decay_x, decay_y;

      this.ctx.strokeStyle = '#888';
      this.ctx.lineWidth = 1;
      this.ctx.strokeRect( 0, 0, configuration.area_width, configuration.area_height );
    });
  }.protect()
});
