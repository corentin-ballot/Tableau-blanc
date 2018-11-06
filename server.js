var http = require('http'),
  WebSocketServer = require('ws').Server,
  port = 1234,
  host = '0.0.0.0';

// create a new HTTP server to deal with low level connection details (tcp connections, sockets, http handshakes, etc.)
var server = http.createServer();


// create a WebSocket Server on top of the HTTP server to deal with the WebSocket protocol
var wss = new WebSocketServer({
  server: server
});

// create a function to be able do broadcast messages to all WebSocket connected clients
wss.broadcast = function broadcast(message) {
  wss.clients.forEach(function each(client) {
    client.send(message);
  });
};

function createNewBoard(client, name) {
  let id = blankboards.length;
  blankboards.push({id: id, owner: unescape(name)});
  subscribers.push([]);
  blankboards_data.push([]);

  return id;
}

function subscribeClient(client, id) {
  // Remove subscribed board
  if(client.subscribe !== undefined)
    subscribers[client.subscribe].splice(subscribers[client.subscribe].indexOf(client),1);
  
  // Subscribe board
  client.subscribe = id;
  subscribers[id].push(client);
}

// Register a listener for new connections on the WebSocket.
wss.on('connection', function(client, request) {

  // retrieve the name in the cookies
  var cookies = request.headers.cookie.split(';');
  var wsname = cookies.find((c) => {
    return c.match(/^\s*wsname/) !== null;
  });
  wsname = wsname.split('=')[1];

  // greet the newly connected user
  // TODO send board list
  client.send(JSON.stringify({type: "boardlist", boards: blankboards}));
  client.subscribe = undefined;

  // Register a listener on each message of each connection
  client.on('message', function(message) {

    let m = JSON.parse(message);
    if(m.type === "subscribe") {
      subscribeClient(client, m.boards_id);
      client.send(JSON.stringify({type: "init_board", data: blankboards_data[client.subscribe]}));
    } else if(m.type === "update") {
      if(client.subscribe === undefined) {
        // create new board and subscribe client
        let id = createNewBoard(client, wsname);
        subscribeClient(client, id);

        client.send(JSON.stringify({type: "init_board", data: blankboards_data[id]}));
        wss.broadcast(JSON.stringify({type: "boardlist", boards: blankboards}));
      }
      // add data 
      blankboards_data[client.subscribe].push(m.data);
      // advertise new data
      subscribers[client.subscribe].forEach(element => {
        element.send(JSON.stringify({type: "update", data: m.data}));
      });
    } else if(m.type === "new_board") {
      // create new board and subscribe client
      let id = createNewBoard(client, wsname);
      subscribeClient(client, id);

      client.send(JSON.stringify({type: "init_board", data: blankboards_data[id]}));
      wss.broadcast(JSON.stringify({type: "boardlist", boards: blankboards}));
    }
    // - update board OK
    // - create board -> broadcast boardlist
    // - join board -> send data OK
  });
});

// http sever starts listening on given host and port.
server.listen(port, host, function() {
  console.log('Listening on ' + server.address().address + ':' + server.address().port);
});

process.on('SIGINT', function() {
  process.exit(0);
});

blankboards = [
  /*{id:0, owner: "Ugly Triangle #5FB8E8"},
  {id:1, owner: "Super Cube #82D8F8"},
  {id:2, owner: "Small Sphere #3C01F6"},*/
];

subscribers = [
 /*[],
 [],
 [],*/
];

blankboards_data = [
  /*[{type:"line", start:{x:0,y:0}, end:{x:100,y:200}, color:"#5FB8E8"},{type:"line", start:{x:100,y:200}, end:{x:100,y:300}, color:"#5FB8E8"}],
  [],
  [],*/
]