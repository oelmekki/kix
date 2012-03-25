DrawQueue = require( '../src/DrawQueue' ).DrawQueue

describe 'DrawQueue', ->
  beforeEach ->
    @draw_queue = new DrawQueue()

  describe 'addPosition()', ->
    describe 'with empty list', ->
      beforeEach ->
        @draw_queue.addPosition( x: 10, y: 20 )

      it 'should add new position', ->
        expect( @draw_queue.queue.getLast() ).toEqual( x: 10, y: 20 )
        
        
    describe 'with already populated list', ->
      beforeEach ->
        @draw_queue.queue = [ { x: 10, y: 20 }, { x: 10, y: 25 } ]
        @draw_queue.addPosition( x: 10, y: 30 )

      it 'should simplify paths', ->
        expect( @draw_queue.queue ).toEqual( [ { x: 10, y: 20 }, { x: 10, y: 30 } ] )

  describe 'reset()', ->
    beforeEach ->
      @draw_queue.queue = [ { x: 10, y: 20 }, { x: 20, y: 30 } ]
      @draw_queue.reset()
      
    it 'should empty position list', ->
      expect( @draw_queue.queue ).toEqual( [] )
      
      
  
