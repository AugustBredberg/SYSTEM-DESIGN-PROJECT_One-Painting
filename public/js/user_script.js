
'use strict';
var socket = io();

var startScreen;
var currentDateNumber = 1;
var table= 3;
let matcharr = [];

let accountQuestions = [
    "Are you adventurous?",
    "Do you prefer a night on the sofa over a night out?"
];

let dateQuestions = [
    "Did date was good for both?",
    "Maybe not?",
    "Ugly?"
];

let currentUser = "";
let currentUserId = 0;
let currentUserObject = {};
let matches = [
    "Emma",
    "Lisa",
    "Sara"
];

const vm = new Vue({
    el: '#loginSection',
    data: {
        user: "",
	pass: "",
	newAccount: {username:"", email:"", password:"", gender: "", agePref: "", desc: []}

	
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
		/// SAVING USERNAME OF USER CURRENTLY LOGGED IN
		
		if(success[0] == true){
		    /// GET USER FROM SERVER FOR FUTURE USE 
		    socket.emit('getUserFromId', success[1], function(usr){
			currentUserObject = usr;
		    });
		    
		    currentUser = usernameLogin;
		    currentUserId = success[1];
		    console.log("userID: " + currentUserId);
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
			vm.readyScreen();
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
	    genderMale.setAttribute("value", "male");
	    let genderLabelMale = document.createElement("label");
	    genderLabelMale.innerHTML = "Male";

	    let genderFemale = document.createElement("input");
	    genderFemale.setAttribute("type", "radio");
	    genderFemale.setAttribute("id", "genderRadioButton");
	    genderFemale.setAttribute("name", "gender");
	    genderFemale.setAttribute("value", "female");
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
		vm.newAccount.username = document.getElementById("Username").value;
		vm.newAccount.email = document.getElementById("E-mail").value;
		vm.newAccount.password = document.getElementById("Password").value;
		
		let genderRadios = document.getElementsByName("gender");
		if(genderRadios[0].checked)
		{
		    vm.newAccount.gender = "male";
		}
		else vm.newAccount.gender = "female";

		vm.newAccount.agePref = document.getElementById("ageDropdown").value;
		
		
		
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
	    
	    vm.personalQuestions(accountQuestions, true);
	},

	loadingDate: function(){
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

	    currentDateNumber += 1;
	    setTimeout(vm.personalQuestions, 1000, dateQuestions, false);
	    
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
	    //currentDateNumber += 1;
	    console.log(currentDateNumber);
	    personalQuestionsText.setAttribute("class", "dateFont");
	    personalQuestionsText.style.fontSize = "900%";
	    div.appendChild(personalQuestionsText);

	    let ready = document.createElement("p");
	    ready.innerHTML = "Ready?";
	    ready.setAttribute("class", "dateFont");
	    ready.style.fontSize = "400%";
	    div.appendChild(ready);

	    let frwBtn = document.createElement("img");
	    frwBtn.setAttribute("src", "/img/loginButton.png");
	    frwBtn.setAttribute("class", "forwardButton");
	    frwBtn.onclick = function(){
		
		vm.nexttableshowing();
	    };

	    div.appendChild(frwBtn);
	},
	
	personalQuestions: function(questions, personalQ){
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

	    let heartAnswerInt = 0;
	    /// CREATES 10 HEARTS. CONTAINS FUNCTION FOR COLORING HEARTS 
	    for(let i=0; i < 10; i++){
		let box = document.createElement("div");
		box.setAttribute("class", "heart");
		box.setAttribute("id", i);
		box.setAttribute("value", ""+i);
		boxesDiv.appendChild(box);
		box.onclick = function(){
		    heartAnswerInt = 0;
		    for(let k=0; k<10; k++){
			console.log("plong");
			let current = document.getElementById(k);
			if(parseInt(this.id) >= k){
			    current.style.backgroundColor = "red";
			    heartAnswerInt++;
			}

			div.appendChild(boxesDiv);

			let frwBtn = document.createElement("img");
			frwBtn.setAttribute("src", "/img/loginButton.png");
			frwBtn.setAttribute("class", "forwardButton");
			frwBtn.onclick = function () {
			    if (questions.length > currentQuestion) {
				for (let k = 0; k < 10; k++) {
				    let current = document.getElementById(k);
				    current.style.backgroundColor = "lightgrey";
				}
				qFunc();
			    } else {
				/// IF IT WAS THE FINAL DATE, JUMP TO INFOSHARE SCREEN
				if (currentDateNumber > 3) {
				    vm.contantInfoShareScreen();
				} else {
				    vm.readyScreen();
				}
			    }
			};

			div.appendChild(frwBtn);
		    },


		    nexttableshowing: function (choosentable) {


			let div = document.getElementById("loginInfoDiv");
			div.innerHTML = "";

			let tableDiv = document.createElement("div");
			tableDiv.setAttribute("class", "tableDiv");

			for(let i = 1; i<11; i++) {
			    if(table == i){
				let choosentable = document.createElement("div");
				choosentable.setAttribute("class", "choosentable");
				choosentable.setAttribute("id", i);
				var text = document.createTextNode(i);
				choosentable.style.fontSize = "400%";
				choosentable.appendChild(text);
				tableDiv.appendChild(choosentable);

			    }
			    else {
				let table = document.createElement("div");
				table.setAttribute("class", "table");
				table.setAttribute("id", i);
				var text = document.createTextNode(i);
				table.style.fontSize = "400%";
				table.appendChild(text);
				//table.setAttribute("value", "" + i);
				tableDiv.appendChild(table);
			    }

			}
		    }
		}//end onclick func
	    }
	    
	    div.appendChild(boxesDiv);
	    let personalDesc = [];
	    let givenRatings = [];
	    
	    let frwBtn = document.createElement("img");
	    frwBtn.setAttribute("src", "/img/loginButton.png");
	    frwBtn.setAttribute("class", "forwardButton");
	    frwBtn.onclick = function(){
		/// If questions are PERSONAL
		if(personalQ) personalDesc.push(heartAnswerInt);
		else          givenRatings.push(heartAnswerInt);
		
		
		if(questions.length > currentQuestion){
		    for(let k=0; k<10; k++){
			let current = document.getElementById(k);
			current.style.backgroundColor = "lightgrey";
		    }
		    qFunc();
		}
		/// THIS ELSE IS FOR: DOCUMENTING NEWLY CREATED ACCOUNTS
		else if(personalQ){
		    vm.newAccount.desc = personalDesc;
		    socket.emit('accountCreated',
				vm.newAccount.username,
				vm.newAccount.email,
				vm.newAccount.password,
				vm.newAccount.gender,
				vm.newAccount.agePref,
				vm.newAccount.desc
			       );
		    /// IF IT WAS THE FINAL DATE, JUMP TO INFOSHARE SCREEN 
		    if(currentDateNumber > 3) vm.contantInfoShareScreen();
		    else vm.readyScreen();
		}
		/// THIS ELSE IS FOR: DOCUMENTING GIVEN RATINGS
		else{
		    socket.emit('getDaters', function(allDaters){
			console.log("HEEJ");
			console.log(allDaters);
			for(let i=0; i < allDaters.length; i++){
			    if(allDaters[i].id == currentUserId){
				let userTMP = allDaters[i];
				allDaters[i].give.push(givenRatings);
			    }

			    
			    /// set recieived rating to person im seeing
			    console.log(currentDateNumber);
			    if(allDaters[i].id == currentUserObject.history[currentDateNumber-2] ){
				allDaters[i].recieved.push(givenRatings);
				console.log("AAAAHHHHGGAHGAHHGHHAHGHAHHGAHGH");
				
			    }
			    
			}
			socket.emit('setDaters', allDaters);
		    });
		    /// IF IT WAS THE FINAL DATE, JUMP TO INFOSHARE SCREEN 
		    if(currentDateNumber > 3) vm.contantInfoShareScreen();
		    else vm.readyScreen();
		}
	    }

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
	let frwBtn = document.createElement("img");
	frwBtn.setAttribute("src", "/img/loginButton.png");
	frwBtn.setAttribute("class", "forwardButton");

	frwBtn.onclick = function () {

	    vm.loadingDate();
	};


	div.appendChild(tableDiv);
	div.appendChild(frwBtn);
    },









    contantInfoShareScreen: function () {

	let matchnumber = 0;
	let div = document.getElementById("loginInfoDiv");
	div.innerHTML = "";

	let shareQ = document.createElement("p");
	shareQ.innerHTML = "Do you want to share your contact info with?";
	shareQ.setAttribute("class", "dateFont");
	shareQ.style.fontSize = "300%";
	div.appendChild(shareQ);


	let matchesDiv = document.createElement("div");
	div.appendChild(matchesDiv);
	let matchesFunc = function () {
	    matchesDiv.innerHTML = "";
	    let match = document.createElement("h3");
	    match.innerHTML = matches[matchnumber];
	    match.style.fontSize = "250%";

	    matchnumber++;
	    matchesDiv.appendChild(match);
	}


	let heartbuttom = document.createElement("img");
	heartbuttom.setAttribute("src", "/img/heart.png");
	heartbuttom.setAttribute("class", "heartButton");

	heartbuttom.onclick = function () {
	    if(matchnumber<3) {
		matcharr.push(matches[matchnumber-1]);
		matchesFunc();
	    }
	    else{
		matcharr.push(matches[matchnumber-1]);
		vm.successmatchscreen();
	    }
	};

	let nobuttom = document.createElement("img");
	nobuttom.setAttribute("src", "/img/cross.jpg");
	nobuttom.setAttribute("class", "noButton");
	nobuttom.onclick = function () {

	    if(matchnumber<3) {
		matchesFunc();
	    }
	    else{
		vm.successmatchscreen();
	    }

	};


	matchesFunc();
	div.appendChild(heartbuttom);
	div.appendChild(nobuttom);


    },


    successmatchscreen: function() {

	let div = document.getElementById("loginInfoDiv");
	div.innerHTML = "";
	var numberofmatches = matcharr.length;
	let nummatch = 0;

	let successmatch = document.createElement("p");
	successmatch.innerHTML = "Congrats, Here are youre matches:";
	successmatch.style.fontSize = "300%";
	div.appendChild(successmatch);



	let successmatchDiv = document.createElement("div");
	successmatchDiv.setAttribute("class", "successmatchDiv");

	for(nummatch; nummatch<numberofmatches; nummatch++){

	    console.log("hej")
	    console.log("matcharr[nummatch]")
	    let match = document.createElement("div");
	    match.setAttribute("class", "match");
	    let text = document.createTextNode(matcharr[nummatch]);
	    match.appendChild(text);
	    successmatchDiv.appendChild(match)

	}

	div.appendChild(successmatchDiv);


	let frwBtn = document.createElement("img");
	frwBtn.setAttribute("src", "/img/loginButton.png");
	frwBtn.setAttribute("class", "forwardButton");

	frwBtn.onclick = function () {

	    vm.endingscreen();
	};

	div.appendChild(frwBtn);

    },



    endingscreen: function(){

	let div = document.getElementById("loginInfoDiv");
	div.innerHTML = "";

	let endtext = document.createElement("p");


	let endheart = document.createElement("img");
	endheart.setAttribute("src", "/img/heart.png");
	endheart.setAttribute("class", "endheart");
	endtext.innerHTML = "Thanks, see you next time ";
	endtext.style.fontSize = "300%";
	div.appendChild(endtext);
	div.appendChild(endheart);


    },







}

		  });





