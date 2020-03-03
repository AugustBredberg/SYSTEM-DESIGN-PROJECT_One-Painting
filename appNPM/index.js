const express = require('express');
const app = express();
const http = require('http').createServer(app);
const path = require('path');

const port = 3000;
var timerStarted = 0;

var io = require('socket.io').listen(http);

var fs = require('fs');

//const myModule = require('./log.js');
//let userArray = myModule.users(); // val is "Hello"

/// ARRAY WITH ALL ACCOUNTS EVER CREATED
//==========================================================
//==========================================================
var userInformation = [];
readInAllUsers = function(){
    var data = fs.readFileSync('log.txt', 'utf8');
    var logins = [];
    var accountInfo = [];
    var lines = data.split('\n');
    for(var line = 0; line < lines.length; line++){
	var array = lines[line].split(",");
	console.log(array.slice(5));
	logins.push(array);
	
	var acc = {
	    "name": array[0],
	    "id": line+1,
	    "gender": array[3],
	    "agePref": array[4],
	    "desc": array.slice(5),
	    "give": "",
	    "recieved": ""
	};
	console.log(acc);
    }
    /// Converting list of accounts to list of objects containing account info
    
    
    console.log(logins);
    userInformation = logins;
    return logins;
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


app.get('/admin_menu', function(req, res) {
  res.sendFile(path.join(__dirname, '../views/admin_menu.html'));
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
Data.prototype.accountCreated = function(username, email, password, gender, agePref, desc){
    //userArray.push(username);
    
    fs.appendFileSync('log.txt',username +","
		      +password+","
		      +email+","
		      +gender+","
		      +agePref+","
		      +desc+"\n", 'utf8', function(error){
	if(error) throw error; // hantera fel just in case
	else console.log("Success when writing username!");
	
    });
};

//Whenever someone connects this gets executed
io.on('connection', function(socket) {
   console.log('A user connected');

    socket.on('accountCreated', function(username, email, password, gender, agePref, desc){
	data.accountCreated(username, email, password, gender, agePref, desc);
	readInAllUsers(); // UPDATING USERLIST WITH NEW USER
    });

    socket.on('getParticipants', function (){
        console.log('Fetching and returning participants!');
        socket.emit('returnParticipants', readInAllUsers());
    })

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
    socket.on('timerStarted', function() {
        console.log('Timer started');
        timerStarted = 1;

    })
    socket.on('timerStopped', function() {
        console.log('Timer stopepd');
        timerStarted = 0;

    })
    socket.on('timerStartedUser',function(){
        console.log(timerStarted);
        if(timerStarted == 1){
            console.log('timer started and return emitted');
            socket.emit("userTimerReturn", true);

        }
        else {
            socket.emit("userTimerReturn", false);

        }


    })
    socket.on('VerifyCode', function (eventcode) {

        fs.readFile('eventcodes.txt', function (err, data) {
            if (err) throw err;
            if(data.indexOf(eventcode) >= 0){
                console.log("Code verified");
                socket.emit('VerifyCodeReturn', true)
            }
            else {
                console.log('Code not verified');
                socket.emit('VerifyCodeReturn', false)
            }
        }
    )});
    socket.on("timerStarted", function() {
	console.log("timer started blalalla");
	socket.emit('timerStartedUser');
    });




    socket.on('EventStarted', function(eventCode){
       console.log("event started");
        fs.appendFileSync('eventcodes.txt', eventCode + '\n', 'utf8', function(error){
            if(error) throw error; // hantera fel just in case
            else console.log("Success when writing username!");
        });
    });

    socket.on('EventStopped', function(eventCode){
        var data = fs.readFileSync('eventcodes.txt', 'utf-8');
        console.log("event stopped");
        var newValue = data.replace((eventCode + '\n'), '');
        fs.writeFileSync('eventcodes.txt', newValue, 'utf-8');
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
>>>>>>> UserAdmin
app.listen(3000, () => {
  console.log('One Love is running on port 3000!')
});
*/
