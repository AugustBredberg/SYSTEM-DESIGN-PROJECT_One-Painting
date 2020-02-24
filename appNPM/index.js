const express = require('express');
const app = express();
const http = require('http').createServer(app);
const path = require('path');

const port = 3000;

var io = require('socket.io').listen(http);

var fs = require('fs');
var FormData = require('form-data');

app.set('port', (process.env.PORT || port ));
app.use(express.static(path.join(__dirname, '../public/')));

app.use('/vue',
  express.static(path.join(__dirname, '/node_modules/vue/dist/')));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../views/index.html'));
});

app.get('/admin', function(req, res) {
  res.sendFile(path.join(__dirname, '../views/admin.html'));
});

var formData = new FormData();
function Data(){
    this.account = {};
}
const data = new Data();

Data.prototype.accountCreated = function(accountInfo){
    //formData.append('username', accountInfo, 'log.js');

    
    let array = [{username: accountInfo}];
    fs.appendFileSync('log.txt', accountInfo, 'utf8', function(error){
	if(error) throw error; // hantera fel just in case
	else console.log("Success when writing!");
    });

};

//Whenever someone connects this gets executed
io.on('connection', function(socket) {
   console.log('A user connected');

    socket.on('accountCreated', function(accountInfo){
	data.accountCreated(accountInfo);
    });
    
   //Whenever someone disconnects this piece of code executed
   socket.on('disconnect', function () {
      console.log('A user disconnected');
   });
});

/// FUNCTION TO WRITE TO FILE HEHEHEHEHEHE


//http.listen(3000);
http.listen(app.get('port'), () => {
  console.log('One Love is running on port 3000!')
})
/*
app.listen(3000, () => {
  console.log('One Love is running on port 3000!')
});
*/
