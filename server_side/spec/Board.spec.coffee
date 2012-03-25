Board = require( '../src/Board' ).Board

describe 'Board', ->
  beforeEach ->
    @Player = getMock 'Player', {
      changeDirection:    true
      positionateRandom:  true
      create:             true
      findNewPosition:    true
      move:               true
    }

    @board = new Board( dependencies: { Player: @Player })

  describe 'gotMessage()', ->
    describe 'when asking to change direction', ->
      beforeEach ->
        @current_player = new @Player()
        @board.players[ 'test' ] = @current_player
        @board.gotMessage action: 'change_direction', id: 'test'

      it 'should delegate to related player', ->
        expect( @current_player.changeDirection.used ).toBe( 1 )


  describe 'addPlayer()', ->
    describe 'with space available', ->
      beforeEach ->
        @board.noCollision = -> ( true )
        @board.addPlayer( 'test' )

      it 'should ask player to find a position', ->
        expect( @Player.prototype.positionateRandom.used ).toBe( 1 )

      it 'should create player', ->
        expect( @Player.prototype.create.used ).toBe( 1 )

    describe 'with no space available anymore', ->
      beforeEach ->
        @board.noCollision = -> ( false )
        @callback = new Moock.Stub( true )
        @board.addEvent( 'full', @callback )
        @board.addPlayer( 'test' )

      it 'should try 99 times to find a position', ->
        expect( @Player.prototype.positionateRandom.used ).toBe( 100 )

      it 'should warn app the board is full', ->
        expect( @callback.used ).toBe( 1 )


  describe 'removePlayer()', ->
    beforeEach ->
      @board.players[ 'test' ] = true
      @board.removePlayer( 'test' )

    it 'should remove requested user', ->
      expect( @board.players[ 'test' ] ).toBeUndefined()


  describe 'move()', ->
    beforeEach ->
      @player1            = new @Player()
      @player2            = new @Player()
      @board.players      = [ @player1, @player2 ]
      @board.noCollision  = -> ( true )
      @board.move()

    it 'should find new position for each player', ->
      expect( @Player.prototype.findNewPosition.used ).toBe( 2 )

    it 'should move players', ->
      expect( @Player.prototype.move.used ).toBe( 2 )
