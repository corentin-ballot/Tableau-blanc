

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

# WebSocket Demo

This project is a simple WebSocket demo. It focusses on showing the basic mechanisms used to create a bidirectional (full duplex) communication WebSocket.

The application is a simple group chat, where any connected client receives messages sent by everyone. There is no [Same-origin policy](https://en.wikipedia.org/wiki/Same-origin_policy) control and security involved.

The application code is two-folded: the server code and the client code.


## The server

In development mode two server are used. One for the static contents of the Web app (html, js, css) and one for the WeBSocket management. The Websocket server uses the basic `http` project plus the  [ws](https://einaros.github.io/ws/) WebSocket implementation.

The WebSocket server is created atop an HTTP server on a different port than the static assets  (html, css, js files) server from Webpack. The Webpack dev server is configured to proxy the WebSocket requests to the WS server.  

What the WS server does is :

- Create an HTTP server
- Create a WebSocket Server and bind it to the HTTP server
- The WebSocket server will maintain a list of connected  WebSocket clients
- Greet any new connection
- Wait for messages from any client and broadcast the message to all the connected clients.

What the static assets server does is :

- serve static assets (html, css, images, js files)
- proxy the WS requests to the WS server


## The client

The client uses the default implementation of the WebSocket standard that is implemented on the browser (good overall support).

What the client does:

- Retrieve a client name from the cookies
- If the name does not exist, then create a new random one.
- Create a WebSocket connection to the server and wait for messages
- On receiving a message, an `<li>` element is created with the content of the message and added to the page
- When text is entered in a form input on the page, and the return key is stroke, the text of the input field is send through the WebSocket, to the server.


## Analysis

This application is a very basic group chat with very little control and no security. The aim here is to show that a very few number of lines of code can already provide great communication facilities.

A more robust application would use a third party library that would take care of security, protocol mismatches and browser support. [Socket.io](http:socket.io) is one of the most achieved projects for WebSockets.
