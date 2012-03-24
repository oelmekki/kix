# Description

Having fun with websockets, node.js and canvas.

I think it will be a mmo version of [qix](http://en.wikipedia.org/wiki/Qix), eventually.

# Usage

Server side code is using node.js.

Install dependencies :

```
npm install mootools
npm install websocket
```

Run server :

```
node server_side/lib/app.js
```

Point your browser to the index.html page (should be behind a real server, to prevent
crossorigin errors).

Enjoy (well, not much, right now).


# Modifying sources

watcher.js is provided as an utility to compile coffeescript and run specs as you save files.

Dependencies :

```
npm install jasmine-node -g
npm install coffeescript -g
```

Launch watcher :

```
node ./watcher.js
```
