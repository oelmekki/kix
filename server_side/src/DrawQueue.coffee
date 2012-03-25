exports.DrawQueue = new Class {
  initialize: ->
    @queue = []
    @


  addPosition: ( new_position ) ->
    @queue.push( new_position )
    @simplify()


  reset: ->
    @queue = []


  # Protected


  simplify: ( ->
    if @queue.length > 2
      start_index = @queue.length - 3
      positions   = @queue.slice( start_index, start_index + 3 )

      if positions.length > 2
        if ( positions[2].x == positions[1].x and positions[2].x == positions[0].x ) or ( positions[2].y == positions[1].y and positions[2].y == positions[0].y )
          @queue.splice( start_index, 3, positions[0], positions[2] )

  ).protect()
}
