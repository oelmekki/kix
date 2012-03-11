var Drawer = new Class({ 
  initialize: function(){
    this.$canvas          = document.getElement( 'canvas' );
    this.ctx              = this.$canvas.getContext( '2d' );
    this.current_radius   = 2;
    this.animation_factor = 1;
    this.players          = [];

    this.$canvas.set( 'width', configuration.area_width );
    this.$canvas.set( 'height', configuration.area_height );
    this.positionateCanvas();

    window.setInterval( this.animate.bind( this ), 125 );
  },


  update: function( players ){
    this.players = players;
    this.ctx.clearRect( 0, 0, configuration.area_width, configuration.area_height );
    this.drawBorder();
    Object.each( players, function( player ){
      this.drawPlayer( player );
    }.bind( this ));
  },


  // Protected


  animate: function(){
    this.current_radius += 1 * this.animation_factor;

    if ( this.current_radius >= 7 ){
      this.current_radius   = 6;
      this.animation_factor = -1;
    }

    if ( this.current_radius <= 2 ){
      this.current_radius   = 3;
      this.animation_factor = 1;
    }

    this.update( this.players );
  },
  

  positionateCanvas: function(){
    var viewport_size = window.getSize();
    this.$canvas.setStyles({ 
      'left': ( viewport_size.x - configuration.area_width ) / 2,
      'top': ( viewport_size.y - configuration.area_height ) / 2
    });
  },
  

  draw: function( drawing_function, params ){
    this.ctx.save();
    drawing_function.call( this, params );
    this.ctx.restore();
  }.protect(),


  drawPlayer: function( player ){
    this.draw( function( player ){
      this.ctx.fillStyle = player.color;
      this.ctx.beginPath();
      this.ctx.arc( player.x + ( configuration.initial.width / 2 ), player.y + ( configuration.initial.height / 2 ), this.current_radius, 0, Math.PI * 2, true );
      this.ctx.fill();
    }, player );
  }.protect(),


  drawBorder: function(){
    this.draw( function(){
      this.ctx.strokeStyle = '#888';
      this.ctx.strokeRect( 0, 0, configuration.area_width, configuration.area_height );
    });
  }.protect()
});
