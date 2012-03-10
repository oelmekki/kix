var Drawer = new Class({ 
  options: {
    canvas_width: 800,
    canvas_height: 800,
    data: {
      x: 30,
      y: 30,
      width: 50,
      height: 55
    }
  },

  initialize: function(){
    this.$canvas  = document.getElement( 'canvas' );
    this.ctx      = this.$canvas.getContext( '2d' );
    this.data     = this.options.data;
    this.draw();
  },


  draw: function(){
    this.ctx.clearRect( 0, 0, this.options.canvas_width, this.options.canvas_height );
    this.drawFirst();
    this.drawSecond();
  },


  change: function( data ){
    this.data = data;
    this.draw();
  },


  // Protected


  drawFirst: function(){
    this.ctx.fillStyle = 'rgb( 200, 0, 0 )';
    this.ctx.fillRect( 10, 10, 55, 50 );
  }.protect(),


  drawSecond: function(){
    this.ctx.fillStyle = 'rgba( 0, 0, 200, 0.5 )';
    this.ctx.fillRect( this.data.x, this.data.y, this.data.width, this.data.height );
  }.protect()
});
