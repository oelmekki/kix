Player    = require( '../src/Player' ).Player
DrawQueue = require( '../src/DrawQueue' ).DrawQueue

describe 'Player', ->
  beforeEach ->
    @DrawQueue = getMock 'DrawQueue', {
      initialize:  true
      addPosition: true
      reset:       true
      is_empty:    false
    }

    @player = new Player( dependencies: { DrawQueue: @DrawQueue } )

  describe 'positionateRandom()', ->
    beforeEach ->
      @player.positionateRandom()

    it "should set player's x position", ->
      expect( @player.x ).not.toBeUndefined()

    it "should set player's y position", ->
      expect( @player.y ).not.toBeUndefined()


  describe 'create()', ->
    beforeEach ->
      @player.create()

    it 'should set a color', ->
      expect( @player.color ).toMatch( /rgb\( \d+, \d+, \d+ \)/ )

    it "should create draw queue", ->
      expect( @DrawQueue.prototype.initialize.used ).toEqual( 1 )


  describe 'findNewPosition()', ->
    beforeEach ->
      @player.x         = 1
      @player.y         = 1
      @player.run       = false
      @player.step      = 1
      @player.direction = 'right'
      @new_position     = @player.findNewPosition()

    it 'should return new position of player according to direction and speed', ->
      expect( @new_position.x ).toBe( 2 )
      expect( @new_position.y ).toBe( 1 )


  describe 'move()', ->
    beforeEach ->
      @player.draw_queue = new @DrawQueue()

    describe 'moving along the edges', ->
      describe 'when not drawing', ->
        beforeEach ->
          @player.x       = 0
          @player.y       = 1
          @player.drawing = false
          @player.move x: 0, y: 0

        it 'should move player', ->
          expect( @player.x ).toBe( 0 )
          expect( @player.y ).toBe( 0 )

      describe 'when drawing', ->
        beforeEach ->
          @player.x       = 0
          @player.y       = 1
          @player.drawing = true
          @player.move x: 0, y: 0

        it 'should move player', ->
          expect( @player.x ).toBe( 0 )
          expect( @player.y ).toBe( 0 )
          
        it 'should reset draw queue', ->
          expect( @player.draw_queue.reset.used ).toBe( 1 )


    describe 'moving somewhere else than edges', ->
      describe 'when not drawing', ->
        beforeEach ->
          @player.x       = 0
          @player.y       = 1
          @player.drawing = false
          @player.move x: 1, y: 1

        it 'should not move player', ->
          expect( @player.x ).toBe( 0 )
          expect( @player.y ).toBe( 1 )

      describe 'when drawing', ->
        beforeEach ->
          @player.x       = 0
          @player.y       = 1
          @player.drawing = true
          @player.move x: 1, y: 1

        it 'should move player', ->
          expect( @player.x ).toBe( 1 )
          expect( @player.y ).toBe( 1 )

        it 'should add new position to draw queue', ->
          expect( @player.draw_queue.addPosition.used ).toBe( 1 )


  describe 'changeDirection()', ->
    describe 'not asking to draw', ->
      beforeEach ->
        @player.changeDirection( direction: 'left' )

      it 'should change direction to requested one', ->
        expect( @player.direction ).toBe( 'left' )


    describe 'asking to draw', ->
      beforeEach ->
        @player.drawing = false
        @player.changeDirection( direction: 'left', draw: true )

      it 'should start drawing', ->
        expect( @player.drawing ).toBeTruthy()
