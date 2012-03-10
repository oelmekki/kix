var Drawer = new Class({ 
  initialize: function(){
    this.$canvas  = document.getElement( 'canvas' );
    this.ctx      = this.$canvas.getContext( '2d' );

    this.$canvas.set( 'width', configuration.area_width );
    this.$canvas.set( 'height', configuration.area_height );
  },


  update: function( players ){
    this.ctx.clearRect( 0, 0, configuration.area_width, configuration.area_height );
    Object.each( players, function( player ){
      this.draw( player );
    }.bind( this ));
  },


  // Protected


  draw: function( player ){
    this.ctx.fillStyle = player.color;
    this.ctx.fillRect( player.x, player.y, player.width, player.height );
  }.protect()
});
