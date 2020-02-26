const express = require('express');
const app = express();
const http = require('http').createServer(app);
const path = require('path');

const port = 3000;

var io = require('socket.io').listen(http);

var fs = require('fs');


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



/*
Data.prototype.loginAttempt = function(username, password){
    var success;
    console.log('Login attempt');
    fs.readFile('log.txt', function (err, data) {
        if (err) throw err;
        if(data.indexOf(username) >= 0){
            if((data.indexOf(username +', ') + ((username).length + 2) - data.indexOf(password)) == 0 ){
                console.log('successful login')
                var success = true;
                console.log('function returning' + success);
                return success;


            }
            else{
                console.log('Failed login attempt')
                var success = false;
                console.log('function returning' + success);
                return success;
            }
        }
        else{
            console.log('Failed login attempt')

            var success = false;
            console.log('function returning' + success);
            return success;
        }
    });


}
*/
Data.prototype.accountCreated = function(username, email, password){
    //formData.append('username', accountInfo, 'log.js');


    fs.appendFileSync('log.txt', '[Username: ' + username + ', ', 'utf8', function(error){
	if(error) throw error; // hantera fel just in case
	else console.log("Success when writing username!");
    });



    fs.appendFileSync('log.txt', 'Password: ' + password + ', ', 'utf8', function(error){
    if(error) throw error; // hantera fel just in case
    else console.log("Success when writing password!");
    });

    fs.appendFileSync('log.txt', 'E-mail: ' + email + '],\n', 'utf8', function(error){
        if(error) throw error; // hantera fel just in case
        else console.log("Success when writing mail!");
    });


};

//Whenever someone connects this gets executed
io.on('connection', function(socket) {
   console.log('A user connected');

    socket.on('accountCreated', function(username, email, password){
	data.accountCreated(username, email, password);
    });

    socket.on('loginAttempt', function(username, password){
        fs.readFile('log.txt', function (err, data) {
            if (err) throw err;
            if(data.indexOf('[Username: ' + username) >= 0){
                console.log((data.indexOf('Username: ' + username +', ') + ((username).length + 22) - data.indexOf(password + ',')))
                if((data.indexOf('Username: ' + username +', ') + ((username).length + 22) - data.indexOf(password + ',')) == 0 ){
                    console.log('successful login')
                    socket.emit('returnLoginSuccess', true)
                }
                else{
                    console.log('Failed login attempt')
                    socket.emit('returnLoginSuccess', false)
                }
            }
            else{
                console.log('Failed login attempt')
                socket.emit('returnLoginSuccess', false)
            }
        })



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
