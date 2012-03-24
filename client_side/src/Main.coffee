window.Main = new Class {

  initialize: () ->
    @drawer = new Drawer()
    @events = new EventHandler()

    @events.addEvent 'change', @drawer.updateData.bind( @drawer )
    @events.addEvent 'viewport_change', @drawer.positionateCanvas.bind( @drawer )
    @


  pause: ->
    @drawer.pause()


  unpause: ->
    @drawer.unpause()
}

document.addEvent 'domready', ->
  window.app = new Main()

