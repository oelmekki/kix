var Drawer = new Class({ 
  initialize: function(){
    this.$canvas  = document.getElement( 'canvas' );
    this.ctx      = this.$canvas.getContext( '2d' );

    this.$canvas.set( 'width', configuration.area_width );
    this.$canvas.set( 'height', configuration.area_height );
  },


  update: function( players ){
    this.ctx.clearRect( 0, 0, configuration.area_width, configuration.area_height );
    this.drawBorder();
    Object.each( players, function( player ){
      this.drawPlayer( player );
    }.bind( this ));
  },


  // Protected
  

  draw: function( drawing_function, params ){
    this.ctx.save();
    drawing_function.call( this, params );
    this.ctx.restore();
  }.protect(),


  drawPlayer: function( player ){
    this.draw( function( player ){
      this.ctx.fillStyle = player.color;
      this.ctx.fillRect( player.x, player.y, player.width, player.height );
    }, player );
  }.protect(),


  drawBorder: function(){
    this.draw( function(){
      this.ctx.strokeStyle = '#000000';
      this.ctx.strokeRect( 0, 0, configuration.area_width, configuration.area_height );
    });
  }.protect()
});
