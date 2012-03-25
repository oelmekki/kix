exports.Board = new Class {
  Extends: require( './Base' ).Base

  options:
    dependencies:
      Player: require( './Player' ).Player

  initialize: ( options ) ->
    @parent( options )
    @players = {}
    @

  run: ->
    setInterval @move.bind(@), configuration.base_beat


  gotMessage: ( message ) ->
    switch message.action
      when 'change_direction'
        @players[ message.id ].changeDirection( message.params ) if @players[ message.id ]


  addPlayer: ( id ) ->
    player = new @Player()

    # try to find a position for new player
    for i in [0..99]
      player.positionateRandom()

      if @noCollision( id, player )
        player.create()
        @players[ id ] = player
        @change()
        break

      else if i == 99
        @fireEvent 'full', id


  removePlayer: ( id ) ->
    delete @players[ id ]
    @change()


  move: ->
    Object.each @players, ( player, id ) =>
      new_position = player.findNewPosition()

      if @noCollision id, new_position
        player.move new_position

    @change()


  # Protected


  change: ( ->
    @fireEvent 'change', [ Object.values( @players ).map( ( player )-> ( player.toJson() ) ) ]
  ).protect()


  noCollision: (( current_id, current_player ) ->
    collide = false

    Object.each @players, ( player, player_id ) =>
      if player_id != current_id
        if @collide( current_player, player )
          collide = true

    ! collide
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
