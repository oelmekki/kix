require( 'mootools' );
var config  = require( '../configuration' ).configuration;
var server  = new ( require( './Server.js' ).Server )( config );
var handler = new ( require( './Handler.js' ).Handler );

server.addEvent( 'message', handler.gotMessage.bind( handler ) );
handler.addEvent( 'change', server.sendJson.bind( server ) );
