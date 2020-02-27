const express = require('express');
const app = express();
const http = require('http').createServer(app);
const path = require('path');

const port = 3000;

var io = require('socket.io').listen(http);

var fs = require('fs');

const myModule = require('./log.js');
let userArray = myModule.users(); // val is "Hello"

/// ARRAY WITH ALL ACCOUNTS EVER CREATED
//==========================================================
//==========================================================
var userInformation = [];
readInAllUsers = function(){
	var data = fs.readFileSync('log.txt', 'utf8');
	var users = [];
	var lines = data.split('\n');
	for(var line = 0; line < lines.length; line++){
	    var array = lines[line].split(",");;
	    users.push(array);
	}	
    console.log(users);
    userInformation = users;
    return users;
};
readInAllUsers();
console.log(userInformation.length);
//==========================================================
//==========================================================


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

function Data(){
    this.account = {};
}
const data = new Data();



/// VERIFIES LOGIN ATTEMPT (WAS USERNAME AND PASSWORD CORRECT)
Data.prototype.loginAttempt = function(usernameInput, passwordInput){
    console.log('Login attempt');
    let username = 0;
    let password = 1;
    for(var i=0; i < userInformation.length; i++){
	let currentAccount = userInformation[i];
	if(currentAccount[username] == usernameInput){
	    if(currentAccount[password] == passwordInput){
		console.log("USERNAME and PASSWORD correct!");
		return true;
	    }
	}
    }
    
    return false;
}

/// WHEN CREATE ACCOUNT IS CLICKED
Data.prototype.accountCreated = function(username, email, password){
    userArray.push(username);
    
    fs.appendFileSync('log.txt',username +","+password+","+email+"\n", 'utf8', function(error){
	if(error) throw error; // hantera fel just in case
	else console.log("Success when writing username!");
	
    });
};

//Whenever someone connects this gets executed
io.on('connection', function(socket) {
   console.log('A user connected');

    socket.on('accountCreated', function(username, email, password){
	data.accountCreated(username, email, password);
	readInAllUsers(); // UPDATING USERLIST WITH NEW USER
    });
    
    socket.on('loginAttempt', function(username, password){
	
        if(Data.prototype.loginAttempt(username, password)){
            console.log('successful login')
            socket.emit('returnLoginSuccess', true)
        }
        else{
            console.log('Failed login attempt')
            socket.emit('returnLoginSuccess', false)
        }
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
