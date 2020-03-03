//Load HTTP module
const express = require('express');
const app = express();
const path = require('path');

var io = require('socket.io')(http);

const port = 3000;
app.set('port', (process.env.PORT || port));
//Create HTTP server and listen on port 3000 for requests
app.use(express.static(path.join(__dirname, 'public/')));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../views/index.html'));
});

app.get('/admin', function(req, res) {
  res.sendFile(path.join(__dirname, '../views/admin.html'));
});


//Whenever someone connects this gets executed
io.on('connection', function(socket) {
   console.log('A user connected');

   //Whenever someone disconnects this piece of code executed
   socket.on('disconnect', function () {
      console.log('A user disconnected');
   });
});


//listen for request on port 3000, and as a callback function have the port listened on logged
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
