var fs    = require( 'fs' );
var spawn = require( 'child_process' ).spawn;

var Watcher = {
  running: false,
  changed: [],

  browse: function( dir_path, callback ){
    fs.stat( dir_path, function( err, stats ){
      if ( ! err && stats.isDirectory() ){
        Watcher.watch( dir_path, callback );

        fs.readdir( dir_path, function( err, file_names ){
          if ( ! err ){
            file_names.forEach( function( file_name ){
              Watcher.browse( dir_path + '/' + file_name );
            });
          }
        });
      }
    });
  },


  watch: function( path, callback ){
    fs.watch( path, function( event, file_name ){
      if ( event == 'change' && file_name[0] != '.' ){
        callback( path, file_name );
      }
    });
  },


  source_changed: function( path, file_name ){
    var base_dir, source_dir, compiled_dir;

    if ( ! Watcher.running && file_name.match( /\.coffee$/ ) && Watcher.changed.indexOf( path + file_name ) === -1 ){
      Watcher.changed.push( path + file_name );

      base_dir     = path.replace( /((?:server|client)_side).*/, '$1/' );
      src_dir      = base_dir + 'src/';
      compiled_dir = base_dir + 'lib/';

      console.log( 'compiling sources...' );
      Watcher.spawn( 'coffee', [ '-c', '-o', compiled_dir, src_dir ], function(){
        Watcher.spec_changed( path, file_name, path + file_name );
        delete Watcher.changed[ Watcher.changed.indexOf( path + file_name ) ];
      });
    }
  },


  spec_changed: function( path, file_name, changed ){
    var base_dir, source_dir, spec_dir, clean_up = false;

    if ( ! changed ){
      if ( ! Watcher.running &&  file_name.match( /\.spec\.coffee$/ ) &&  Watcher.changed.indexOf( path + file_name ) === -1 ){
        changed  = path + file_name;
        clean_up = true;
        Watcher.changed.push( path + file_name );
      }
    }

    if ( changed ){
      base_dir  = path.replace( /((?:server|client)_side).*/, '$1/' );
      src_dir   = base_dir + 'src/';
      spec_dir  = base_dir + 'spec/';

      console.log( 'launching specs...' );
      Watcher.spawn( 'jasmine-node', [ '--coffee', spec_dir ], function(){
        if ( clean_up ){
          delete Watcher.changed[ Watcher.changed.indexOf( changed ) ];
        }
      });
    }
  },


  spawn: function( command, args, callback ){
    if ( ! Watcher.running ){
      Watcher.running = true;

      var proc, print;

      print = function( data ){
        data = data.toString();
        process.stdin.write( data );
      };
      
      proc = spawn( command, args );

      proc.stdout.on( 'data', print );
      proc.stderr.on( 'data', print );

      if ( callback ){
        proc.on( 'exit', callback );
      }

      proc.stdin.end();
      Watcher.running = false;
    }
  }
};


Watcher.browse( './server_side/src/', Watcher.source_changed );
Watcher.browse( './client_side/src/', Watcher.source_changed );
Watcher.browse( './server_side/spec/', Watcher.spec_changed );
Watcher.browse( './client_side/spec/', Watcher.spec_changed );
