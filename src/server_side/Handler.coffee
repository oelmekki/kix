exports.Handler = new Class {
  Implements: Events,

  initialize: ( config ) ->
    @players  = {}
    @config   = config
    @step     = config.step
    @run_step = config.run_step

    setInterval( @move.bind(@), config.base_beat )
    @


  gotMessage: ( message ) ->
    switch message.action
      when 'change_direction'
        this.changeDirection( message.id, message.params )


  addPlayer: ( id ) ->
    player = Object.clone @config.initial

    # try to find a position for new player
    for i in [0..99]
      starting_edge = Number.random 1, 4

      # top or bottom
      if [ 1, 2 ].indexOf( starting_edge ) isnt -1
         player.x = Number.random 0, @config.area_width
         player.y = starting_edge == 1 ? 0 : @config.area_height

      # left or right
      else
         player.y = Number.random 0, @config.area_height
         player.x = starting_edge == 3 ? 0 : @config.area_width

      if @noCollision( id, player )
        player.color        = 'rgb( ' + Number.random( 10, 255 )  + ', ' + Number.random( 10, 255 ) + ', ' + Number.random( 10, 255 ) + ' )'
        player.drawn        = [ { x: player.x, y: player.y } ]
        @players[ id ]      = player

        @change()
        break

      else if i == 99
        @fireEvent 'full', id


  removePlayer: ( id ) ->
    delete @players[ id ]
    @change()


  changeDirection: ( id, options ) ->
    if  @players[ id ] and [ 'up', 'right', 'down', 'left' ].indexOf( options.direction ) != -1
      @players[ id ].direction = options.direction
      @players[ id ].run       = !! options.run
      
      if options.draw
        if ! @players[ id ].draw and @isOnSafeZone( @players[ id ] )
          @players[ id ].drawn   = []
          @players[ id ].drawing = true


  move: ->
    Object.each @players, ( player, id ) =>
      change = true

      step = if player.run then @run_step else @step

      new_position =
        x: player.x
        y: player.y
        width: player.width
        height: player.height

      switch  player.direction
        when 'up'
          new_position.y -= step

        when 'right'
          new_position.x += step

        when 'down'
          new_position.y += step

        when 'left'
          new_position.x -= step

        else
          change = false

      if change and @noCollision id, new_position
        @fixPosition new_position

        if @isOnSafeZone new_position
          player.x = new_position.x
          player.y = new_position.y

        else if player.drawing
          player.drawn.push({ x: new_position.x, y: new_position.y })
          player.x = new_position.x
          player.y = new_position.y

    @change()


  # Protected


  change: ( ->
    @fireEvent 'change', [ Object.values( @players ) ]
  ).protect()


  noCollision: (( current_id, new_position ) ->
    collide = false

    Object.each @players, ( player, player_id ) =>
      if player_id != current_id
        if @collide( new_position, player )
          collide = true

    ! collide
  ).protect()


  isOnSafeZone: (( position ) ->
    if position.y == 0 and position.x >= 0 and position.x <= @config.area_width
      return true

    if position.y == @config.area_height and position.x >= 0 and position.x <= @config.area_width
      return true

    if position.x == 0 and position.y >= 0 and position.y <= @config.area_height
      return true

    if position.x == @config.area_width and position.y >= 0 and position.y <= @config.area_height
      return true

    return false
  ).protect()


  fixPosition:(( new_position ) ->
    if new_position.x < 0
      new_position.x = 0

    if new_position.x > @config.area_width
      new_position.x = @config.area_width

    if new_position.y < 0
      new_position.y = 0

    if new_position.y > @config.area_height
      new_position.y = @config.area_height
  ).protect()


  collide: (( current, other ) ->
    if ! (current.x + current.width >= other.x )
      return false

    if ! ( current.x <= other.x + other.width )
      return false

    if ! ( current.y - current.height <= other.y )
      return false

    if ! ( current.y >= other.y - other.height )
      return false

    return true
  ).protect()
}

