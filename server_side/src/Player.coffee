exports.Player = new Class {
  initialize: ->
    @step     = configuration.step
    @run_step = configuration.run_step

    for own attr, value of configuration.initial
      @[ attr ] = value
    @


  positionateRandom: ->
    starting_edge = Number.random 1, 4

    # top or bottom
    if [ 1, 2 ].indexOf( starting_edge ) isnt -1
      @x = Number.random 0, configuration.area_width
      @y = if starting_edge == 1 then 0 else configuration.area_height

    # left or right
    else
      @y = Number.random 0, configuration.area_height
      @x = if starting_edge == 3 then 0 else configuration.area_width

    console.log @x, @y


  create: ->
    @color = 'rgb( ' + Number.random( 10, 255 )  + ', ' + Number.random( 10, 255 ) + ', ' + Number.random( 10, 255 ) + ' )'
    @drawn = [ { x: @x, y: @y } ]
    

  findNewPosition: ->
    step = if @run then @run_step else @step

    new_position =
      x: @x
      y: @y
      width: @width
      height: @height

    switch  @direction
      when 'up'
        new_position.y -= step

      when 'right'
        new_position.x += step

      when 'down'
        new_position.y += step

      when 'left'
        new_position.x -= step

    new_position


  move: ( new_position ) ->
    @fixPosition( new_position )

    if @isOnSafeZone new_position
      @x = new_position.x
      @y = new_position.y

    else if @drawing
      @drawn.push({ x: new_position.x, y: new_position.y })
      @x = new_position.x
      @y = new_position.y


  changeDirection: ( options ) ->
    if  [ 'up', 'right', 'down', 'left' ].indexOf( options.direction ) != -1
      @direction = options.direction
      @run       = !! options.run
      
      if options.draw
        if ! @draw and @isOnSafeZone( @ )
          @drawn   = []
          @drawing = true


  # Protected


  isOnSafeZone: ( ( position ) ->
    if position.y == 0 and position.x >= 0 and position.x <= configuration.area_width
      return true

    if position.y == configuration.area_height and position.x >= 0 and position.x <= configuration.area_width
      return true

    if position.x == 0 and position.y >= 0 and position.y <= configuration.area_height
      return true

    if position.x == configuration.area_width and position.y >= 0 and position.y <= configuration.area_height
      return true

    return false
  ).protect()


  fixPosition: ( ( new_position ) ->
    if new_position.x < 0
      new_position.x = 0

    if new_position.x > configuration.area_width
      new_position.x = configuration.area_width

    if new_position.y < 0
      new_position.y = 0

    if new_position.y > configuration.area_height
      new_position.y = configuration.area_height
  ).protect()
}
