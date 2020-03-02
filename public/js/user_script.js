
'use strict';
var socket = io();

var startScreen;
var currentDateNumber = 1;

let accountQuestions = [
    "Are you adventurous?",
    "Do you prefer a night on the sofa over a night out?"
];

let dateQuestions = [
    "Did date was good for both?",
    "Maybe not?",
    "Ugly?"
];
socket.on('timerStartedUser', function(){
    console.log("Testelitest");
})

const vm = new Vue({
    el: '#loginSection',
    data: {
    	waiting: true,
        user: "",
		pass: "",
		newAccount: {username:"", email:"", password:""}

     
    },

    methods: {
	//login: function(){loginClicked();},
	//createAccount: function(){createAccountClicked();},
        markDone: function() {

	},
	
	login: function(usernameLogin, passwordLogin){
		console.log("clicklogin");
	    console.log(usernameLogin);
	    console.log(passwordLogin);
		socket.emit('loginAttempt', usernameLogin, passwordLogin);
		socket.on('returnLoginSuccess', function(success){

			if(success == true){
				let div = document.getElementById("loginInfoDiv");
				div.innerHTML = "";

				let eventCodeText = document.createElement("h2");
				eventCodeText.innerHTML = "Enter Eventcode";
				eventCodeText.style.fontSize = "300%";

				let eventCode = document.createElement("input");
				eventCode.setAttribute("class", "userLogin");
				eventCode.setAttribute("placeholder", "Eventcode");

				let frwBtn = document.createElement("img");
				frwBtn.setAttribute("src", "/img/loginButton.png");
				frwBtn.setAttribute("class", "forwardButton");
				frwBtn.onclick = function(){

					console.log("KOLLA FILIP DET FUNKAR");
					console.log(eventCode.value);
					socket.emit('VerifyCode', eventCode.value);
					socket.on('VerifyCodeReturn', function (success) {
						if(success == true){
							vm.readyScreen();
						}
						else{
							console.log('Invalid code');
						}

					})

					//loadingDate();
				};

				div.appendChild(eventCodeText);
				div.appendChild(eventCode);
				div.appendChild(frwBtn);

			}
			else{
				console.log('Invalid username or password');
			}
		})


	},
	createAccount: function(){
	    let accountInfo2 = {username:"",password:"", email:""};
	    
	    let accountInfo = [
		"Username",
		"E-mail",
		"Password",
		"Re-enter Password"
	    ];
	    let linebreak = document.createElement("br");
	    
	    let div = document.getElementById("loginInfoDiv");
	    startScreen = div.innerHTML;
	    div.innerHTML = "";
	    
	    
	    let headerText = document.createElement("h2");
	    headerText.innerHTML = "Account information";
	    headerText.style.fontSize = "300%";
	    div.appendChild(headerText);

	    // GENDER AND AGE 
	    let genderAgeDiv = document.createElement("div");
	    genderAgeDiv.setAttribute("class", "genderAgeChoiceDiv");

	    // GENDER RADIO
	    let genderDiv = document.createElement("ul");
	    genderDiv.setAttribute("align", "left");
	    genderAgeDiv.setAttribute("class", "genderAgeChoiceDiv");
	    
	    let genderMale = document.createElement("input");
	    genderMale.setAttribute("type", "radio");
	    genderMale.setAttribute("id", "genderRadioButton");
	    genderMale.setAttribute("name", "gender");
	    let genderLabelMale = document.createElement("label");
	    genderLabelMale.innerHTML = "Male";

	    let genderFemale = document.createElement("input");
	    genderFemale.setAttribute("type", "radio");
	    genderFemale.setAttribute("id", "genderRadioButton");
	    genderFemale.setAttribute("name", "gender");
	    let genderLabelFemale = document.createElement("label");
	    genderLabelFemale.innerHTML = "Female";
	    
	    genderDiv.appendChild(genderMale);
	    genderDiv.appendChild(genderLabelMale);
	    genderDiv.appendChild(linebreak);
	    genderDiv.appendChild(genderFemale);
	    genderDiv.appendChild(genderLabelFemale);

	    // AGE DROPDOWN 
	    let ages = [ "18-25", "26-35", "35-45", "45-55", "56+" ];

	    let ageDropdown = document.createElement("select");
	    ageDropdown.setAttribute("id", "ageDropdown");

	    for(let x in ages){
		let temp = document.createElement("option");
		temp.setAttribute("id", "ageOption");
		temp.innerHTML = ages[x];
		ageDropdown.appendChild(temp);
	    }
	    
	    genderAgeDiv.appendChild(genderDiv);
	    genderAgeDiv.appendChild(ageDropdown);
	    div.appendChild(genderAgeDiv);

	    // TEXT INPUT USERNAME, PASSWORD ETC
	    for(let inf in accountInfo){
		let temp = document.createElement("input");
		temp.setAttribute("class", "userLogin");
		temp.setAttribute("id", accountInfo[inf]);
		temp.setAttribute("placeholder", accountInfo[inf]);
		div.appendChild(temp);
	    }

	    let frwBtn = document.createElement("img");
	    frwBtn.setAttribute("src", "/img/loginButton.png");
	    frwBtn.setAttribute("class", "forwardButton");
	    frwBtn.onclick = function(){
		accountInfo2.username = document.getElementById("Username").value;
		accountInfo2.email = document.getElementById("E-mail").value;
		accountInfo2.password = document.getElementById("Password").value;

		socket.emit('accountCreated', accountInfo2.username, accountInfo2.email, accountInfo2.password);
		
		vm.accountCreationVerification();
	    };
	    
	    div.appendChild(frwBtn);

	},
	accountCreationVerification: function(){
	    //location.reload(true);
	    let messageDiv = document.createElement("div");
	    messageDiv.setAttribute("align", "center");
	    let section = document.getElementById("loginSection");
	    //div.innerHTML = startScreen;

	    //let section = document.getElemen
	    let accountVerification = document.createElement("label");
	    accountVerification.setAttribute("id", "accountCreationSuccessMessage");
	    accountVerification.innerHTML = "Account Created Successfully!";

	    messageDiv.appendChild(accountVerification);
	    section.prepend(messageDiv);
	    
	    vm.personalQuestions(accountQuestions);
	},

	loadingDate: function(loadTime){
	    let div = document.getElementById("loginInfoDiv");
	    div.innerHTML = "";
	    div.setAttribute("style", "height: 55vh");

	    let dateInProgress = document.createElement("p");
	    dateInProgress.innerHTML = "Date in progress";
	    dateInProgress.setAttribute("class", "dateFont");
	    dateInProgress.style.fontSize = "400%";
	    div.appendChild(dateInProgress);
	    
	    let pulsatingHeart = document.createElement("div");
	    pulsatingHeart.setAttribute("class", "lds-heart");

	    let tempdiv = document.createElement("div");
	    pulsatingHeart.appendChild(tempdiv);

	    div.appendChild(pulsatingHeart);

	    /// IF DATE IS FINAL DATE, SHOW INFORMATION SHARING SCREEN
	    
	    setTimeout(vm.personalQuestions, loadTime, dateQuestions);
	    
	},

	readyScreen: function(){
	    
	    let div = document.getElementById("loginInfoDiv");
	    let successText = document.getElementById("accountCreationSuccessMessage");
	    if(successText != null){
		successText.remove();
	    }
	    div.innerHTML = "";

	    let personalQuestionsText = document.createElement("p");
	    personalQuestionsText.innerHTML = "Date: " + currentDateNumber;
	    currentDateNumber ++;
	    personalQuestionsText.setAttribute("class", "dateFont");
	    personalQuestionsText.style.fontSize = "900%";
	    div.appendChild(personalQuestionsText);

	    let ready = document.createElement("p");
	    ready.innerHTML = "Ready?";
	    ready.setAttribute("class", "dateFont");
	    ready.style.fontSize = "400%";
	    div.appendChild(ready);
	    console.log('Här vare sockets');
	    
	    socket.on('timerStartedUser', function(){
		console.log("hejehejehjeheje");
		let timerReady = document.createElement("p");
		timerReady.innerHTML = "Timer Started :)";
		timerReady.setAttribute("class", "dateFont");
		timerReady.style.fontSize = "400%";
		div.appendChild(timerReady);
	    })
		
	    

	    let frwBtn = document.createElement("img");
	    frwBtn.setAttribute("src", "/img/loginButton.png");
	    frwBtn.setAttribute("class", "forwardButton");
	    frwBtn.onclick = function(){
	    	frwBtn.setAttribute("src", "/img/waitscreen.png");
	    	console.log("kall1");
	    	vm.myLoop(500);

	    };

	    div.appendChild(frwBtn);
	},

	myLoop: function(i) {
		setTimeout(function () {
			socket.emit('timerStartedUser');
			socket.on('userTimerReturn', function(startedBool) {
				if(startedBool == true && vm.waiting) {
					vm.waiting = false;
					vm.loadingDate(5000);
				}})
			if (--i) vm.myLoop(i);      //  decrement i and call myLoop again if i > 0
		}, 3000)
	},


	foo: function (){
		console.log('foo');
	},
	personalQuestions: function(questions){
	    let currentQuestion = 0;
	    /*let questions = [
	      "Are you adventurous?",
	      "Do you prefer a night on the sofa over a night out?"
	      ];*/
	    
	    console.log("click");
	    let div = document.getElementById("loginInfoDiv");
	    div.innerHTML = "";

	    let personalQuestionsText = document.createElement("h2");
	    personalQuestionsText.innerHTML = "Personal Questions";
	    personalQuestionsText.style.fontSize = "300%";
	    div.appendChild(personalQuestionsText);
	    
	    let questionsDiv = document.createElement("div");
	    div.appendChild(questionsDiv);
	    
	    

	    let qFunc = function(){
		questionsDiv.innerHTML = "";
		let question = document.createElement("h3");
		question.innerHTML = questions[currentQuestion];
		question.style.fontSize = "250%";
		
		currentQuestion ++;
		questionsDiv.appendChild(question);
	    }
	    qFunc();

	    let boxesDiv = document.createElement("div");
	    boxesDiv.setAttribute("class", "boxesDiv");

	    /// CREATES 10 HEARTS. CONTAINS FUNCTION FOR COLORING HEARTS 
	    for(let i=0; i < 10; i++){
		let box = document.createElement("div");
		box.setAttribute("class", "heart");
		box.setAttribute("id", i);
		box.setAttribute("value", ""+i);
		boxesDiv.appendChild(box);
		box.onclick = function(){

		    for(let k=0; k<10; k++){
			console.log("plong");
			let current = document.getElementById(k);
			if(parseInt(this.id) >= k){
			    current.style.backgroundColor = "red";
			}
			else{
			    current.style.backgroundColor = "lightgrey";
			}
		    }
		}//end onclick func
	    }
	    
	    div.appendChild(boxesDiv);
	    
	    let frwBtn = document.createElement("img");
	    frwBtn.setAttribute("src", "/img/loginButton.png");
	    frwBtn.setAttribute("class", "forwardButton");
	    frwBtn.onclick = function(){
		if(questions.length > currentQuestion){
		    for(let k=0; k<10; k++){
			let current = document.getElementById(k);
			current.style.backgroundColor = "lightgrey";
		    }
		    qFunc();
		}
		else{
		    /// IF IT WAS THE FINAL DATE, JUMP TO INFOSHARE SCREEN 
		    if(currentDateNumber > 3){
			vm.contantInfoShareScreen();
		    }
		    else{
			vm.readyScreen();
		    }
		}
	    };

	    div.appendChild(frwBtn);
	},




	contantInfoShareScreen: function(){
	    let div = document.getElementById("loginInfoDiv");
	    div.innerHTML = "";

	    let shareInfoText = document.createElement("p");
	    shareInfoText.innerHTML = "You matched with Pristian Puuk!";
	    shareInfoText.setAttribute("class", "dateFont");
	    shareInfoText.style.fontSize = "400%";
	    div.appendChild(shareInfoText);

	    let shareQ = document.createElement("p");
	    shareQ.innerHTML = "Do you want to share your contact info?";
	    shareQ.setAttribute("class", "dateFont");
	    shareQ.style.fontSize = "300%";
	    div.appendChild(shareQ);
	    
	}

    }

});





