Board = require( '../../src/server_side/Board' ).Board

describe 'Board', ->
  beforeEach ->
    @board = new Board( configuration, false )

  it 'should be true', ->
    expect( true ).toBeTruthy()
