exports.Base = new Class {
  Implements: [ Options, Events ]

  options:
    dependencies: {}

  initialize: ( options ) ->
    @setOptions options

    for name, object of @options.dependencies
      @[ name ] = object

    @
}
