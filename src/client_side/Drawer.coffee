window.Drawer = new Class {
  initialize: ->
    @$canvas          = document.getElement( 'canvas' )
    @ctx              = @$canvas.getContext( '2d' )
    @current_radius   = 2
    @animation_factor = 1
    @players          = []
    @running          = true
    @synced           = false

    @$canvas.set 'width', configuration.area_width + ( configuration.initial.width * 2 )
    @$canvas.set 'height', configuration.area_height + ( configuration.initial.height * 2 )
    @ctx.translate configuration.initial.width, configuration.initial.height
    @positionateCanvas()

    window.setInterval @animate.bind(@), 125
    window.setInterval @update.bind(@), configuration.base_beat
    @


  updateData: ( players ) ->
    @players = players
    @synced  = true


  update: ->
    if @running
      @clear()
      @drawBorder()
      Object.each this.players, ( player ) =>
        @drawPlayer player

      @synced = false
  

  positionateCanvas: ->
    viewport_size = window.getSize()

    @$canvas.setStyles {
      'left': ( viewport_size.x - ( configuration.area_width + configuration.initial.width ) ) / 2
      'top': ( viewport_size.y - ( configuration.area_height + configuration.initial.height ) ) / 2
    }


  pause: ->
    @running = false


  unpause: ->
    @running = true


  # Protected


  clear: ( ->
    @draw ->
      @ctx.translate( - configuration.initial.width, - configuration.initial.height )
      @ctx.clearRect 0, 0, configuration.area_width + ( configuration.initial.width * 2 ), configuration.area_height + ( configuration.initial.height * 2 )
  ).protect()


  animate: ->
    if @running
      @current_radius += 1 * @animation_factor

      if @current_radius >= 7
        @current_radius   = 6
        @animation_factor = -1

      if @current_radius <= 2
        @current_radius   = 3
        @animation_factor = 1
  

  draw: (( drawing_function, params ) ->
    @ctx.save()
    drawing_function.call @, params
    @ctx.restore()
  ).protect()


  drawPlayer: ( ( player ) ->
    if ! @synced
      @anticipate player

    @draw ( ( player ) =>
      @ctx.fillStyle = player.color

      if player.drawn.length
        path              = Array.clone player.drawn
        start             = path.shift()
        @ctx.strokeStyle  = player.color

        @ctx.beginPath()
        @ctx.moveTo start.x, start.y

        player.drawn.each ( coord ) =>
          @ctx.lineTo( coord.x, coord.y )

        @ctx.stroke()

      @ctx.beginPath()
      @ctx.arc player.x, player.y, @current_radius, 0, Math.PI * 2, true
      @ctx.fill()
    ), player
  ).protect()


  anticipate: ( player ) ->
    step = configuration[ if player.run then 'run_step' else 'step' ]

    switch player.direction
      when 'top'
        if  player.y - step <= 0
          player.y -= step

      when 'right'
        if player.x + step <= configuration.area_width
          player.x += step

      when 'bottom'
        if player.y + step <= configuration.area_height
          player.y += step

      when 'left'
        if player.x - step >= 0
          player.x -= step


  drawBorder: ( ->
    @draw =>
      @ctx.strokeStyle = '#888'
      @ctx.lineWidth = 1
      @ctx.strokeRect 0, 0, configuration.area_width, configuration.area_height
    
  ).protect()
}

