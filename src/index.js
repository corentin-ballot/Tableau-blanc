import './index.css';
import nameGenerator from './name-generator';
import isDef from './is-def';
  
  

// Store/retrieve the name in/from a cookie.
const cookies = document.cookie.split(';');
console.log(cookies)
let wsname = cookies.find(function(c) {
  if (c.match(/wsname/) !== null) return true;
  return false;
});
if (isDef(wsname)) {
  wsname = wsname.split('=')[1];
} else {
  wsname = nameGenerator();
  document.cookie = "wsname=" + encodeURIComponent(wsname);
}

// Set the name in the header
document.querySelector('header>p').textContent = decodeURIComponent(wsname);

// Create a WebSocket connection to the server
const ws = new WebSocket("ws://" + window.location.host+ "/socket");

// We get notified once connected to the server
ws.onopen = (event) => {
  console.log("We are connected.");
};

// Listen to messages coming from the server. When it happens, create a new <li> and append it to the DOM.

ws.onmessage = (event) => {  
  let m = JSON.parse(event.data);
  if(m.type === "boardlist") {
    var boardlist = document.getElementById("boards");
    while (boardlist.firstChild) {
      boardlist.removeChild(boardlist.firstChild);
    }

    m.boards.forEach(function each(element) {
      var board = document.createElement('div');
      board.setAttribute('class', "board");
      board.setAttribute('id', "board_" + element.id);
      board.textContent = element.owner;
      boardlist.appendChild(board);

      board = document.getElementById("board_" + element.id);
      board.addEventListener("click", function(event){
        context.clearRect(0, 0, canvas.width, canvas.height);
        ws.send(JSON.stringify({type: "subscribe", boards_id:element.id}));
      });
    });
  } // endif type === boardlist
  else if(m.type === "update") {
    switch(m.data.type){
    case "line":
    drawLine(m.data.start.x, m.data.start.y, m.data.end.x, m.data.end.y, m.data.color);
    break;
    default: break;
    }
  } // endif type === update
  else if(m.type === "init_board") {
    console.log(m);
    m.data.forEach(element => {
      switch(element.type){
      case "line":
      drawLine(element.start.x, element.start.y, element.end.x, element.end.y, element.color);
      break;
      default: break;
      }
    });
  } // endif type === init_board
};

// Retrieve the input element. Add listeners in order to send the content of the input when the "return" key is pressed.
function sendMessage(event) {
  event.preventDefault();
  event.stopPropagation();
  if (sendInput.value !== '') {
    // Send data through the WebSocket
    ws.send(sendInput.value);
    sendInput.value = '';
  }
}
const sendForm = document.querySelector('form');
const sendInput = document.querySelector('form input');
sendForm.addEventListener('submit', sendMessage, true);
sendForm.addEventListener('blur', sendMessage, true);

var sensors = [];
console.log(sensors);

// Canvas

function drawLine(xstart, ystart, xend, yend, color) {
  context.fillStyle = color;
  context.strokeStyle = color;
  context.beginPath();
  context.moveTo(xstart, ystart);
  context.lineTo(xend, yend);
  context.closePath();
  context.stroke();//On trace seulement les lignes.
}

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

var canvas = document.getElementById('activeboard');
var context = canvas.getContext('2d');
var draw = false;
var start = {x:0,y:0};
var end = {x:0,y:0};

canvas.addEventListener('mousemove', function(evt) {
  if(draw) {
    var mousePos = getMousePos(canvas, evt);
    end = {x:mousePos.x, y:mousePos.y};
    ws.send(JSON.stringify({type: "update", data:{type:"line", start:start, end:end, color:decodeURIComponent(wsname).split(' ')[2]}}));
    start = {x:mousePos.x, y:mousePos.y};
  }
}, false);

canvas.addEventListener('mousedown', function(evt) {
  var mousePos = getMousePos(canvas, evt);
  start = {x:mousePos.x, y:mousePos.y};
  draw = true;
}, false);

canvas.addEventListener('mouseup', function(evt) {
  draw = false;
}, false);

document.getElementById("new_board").addEventListener("click", function(event){
  ws.send(JSON.stringify({type: "new_board"}));
  context.clearRect(0, 0, canvas.width, canvas.height);
});