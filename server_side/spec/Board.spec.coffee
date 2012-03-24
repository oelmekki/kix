require './helper.spec'
Board = require( '../src/Board' ).Board

describe 'Board', ->
  beforeEach ->
    @board = new Board( false )

  it 'should be true', ->
    expect( true ).toBeTruthy()
