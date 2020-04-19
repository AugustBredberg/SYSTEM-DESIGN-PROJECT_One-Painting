'use strict';
var socket = io();

var startScreen;
var currentDateNumber = 1;
var tableNr = 0;
let matcharr = [];
var currUsr = "";
var currPass = "";
var tableList = [];
var timer;
var date = 0;
var successmatchLock = true;
let cont = true;
let accountQuestions = [
    "Are you adventurous?",
    "Do you prefer a night on the sofa over a night out?"
];

let dateQuestions = [
    "Did you have things in common with your date?",
    "How fun was your date?",
    "How was the overall experience?"
];

function updateUsers() {
    socket.emit('getDaters', function(daters) {
        for (var i = 0; i < removedUsers.length; i++) {
            daters.splice(daters.indexOf(removedUsers[i]), 1);
        }
        vm_users.users = daters;
    });
}




let currentUser = "";
let currentUserId = 0;
let currentUserObject = {};
let matches = [];

socket.on('tables', function(tables) {
    tableList = tables;
    for(var i = 0; i < tableList.length; i++){
	
	if(currentUserObject.name === tableList[i][1].name){
	    
	    if(!matches.some(person => person.name === tableList[i][2].name)){
		matches.push(tableList[i][2]);
	    }
	    
	} else if(currentUserObject.name === tableList[i][2].name){

	    if(!matches.some(person => person.name === tableList[i][1].name)){
		matches.push(tableList[i][1]);
	    }
	    
	}
    }
});

const vm = new Vue({
    el: '#loginSection',
    data: {
        waiting: true,
        user: "",
        pass: "",
        newAccount: { username: "", email: "", password: "", gender: "", agePref: "", desc: [] }
    },

    methods: {
        markDone: function() {

        },

        login: function(usernameLogin, passwordLogin) {
            socket.emit('loginAttempt', usernameLogin, passwordLogin);
            socket.on('returnLoginSuccess', function(success) {
                /// SAVING USERNAME OF USER CURRENTLY LOGGED IN

                if (success[0] == true) {
                    /// GET USER FROM SERVER FOR FUTURE USE 
                    socket.emit('getUserFromId', success[1], function(usr) {
                        currentUserObject = usr;
                    });

                    if (usernameLogin === "admin") {
                        document.location.href = "/admin_menu";
                    }

                    currentUser = usernameLogin;
                    currentUserId = success[1];
                    let div = document.getElementById("loginInfoDiv");
                    div.innerHTML = "";

                    let eventCodeText = document.createElement("h2");
                    eventCodeText.innerHTML = "Enter Eventcode";
                    eventCodeText.style.fontSize = "300%";

                    let eventCode = document.createElement("input");
                    eventCode.setAttribute("class", "userLogin");
                    eventCode.setAttribute("placeholder", "Eventcode");
                    eventCode.setAttribute("value", "");


                    let frwBtn = document.createElement("img");
                    frwBtn.setAttribute("src", "/img/loginButton.png");
                    frwBtn.setAttribute("class", "forwardButton");

                    let hstBtn = document.createElement("button");
                    hstBtn.setAttribute("class", "historyBtn");
                    hstBtn.appendChild(document.createTextNode("History"));

                    frwBtn.onclick = function() {
                        socket.emit('getEventcode', function(serverEventCode) {
                            if (serverEventCode == eventCode.value && eventCode.value != "") {
                                socket.emit('appendToDaters', currentUserObject);
                                vm.readyScreen();
                            }
                        });
                    };

                    hstBtn.onclick = function() {
                        currUsr = usernameLogin;
                        currPass = passwordLogin;

                        vm.history();
                    }

                    div.appendChild(eventCodeText);
                    div.appendChild(eventCode);
                    div.appendChild(frwBtn);
                    div.appendChild(hstBtn);

                } else {
                    alert('Invalid username or password');
                }
            })


        },
        history: function() {
            let div = document.getElementById("loginInfoDiv");
            div.innerHTML = "";

            let header = document.createElement("h2");
            header.style.fontSize = "300%";
            header.appendChild(document.createTextNode("Matches:"));

            let matchDiv = document.createElement("div");
            for (let i = 0; i < 3; i++) {
                let match_header = document.createElement("h2");
                match_header.style.fontSize = "300%";
                match_header.style.border = "5px solid black";
                match_header.style.padding = "2%";

                if (i === 0) {
                    match_header.innerHTML = "Kim: 073272973, kim@gmail.com";
                } else if (i === 1) {
                    match_header.innerHTML = "Sam: 073723973, sam@gmail.com";
                } else {
                    match_header.innerHTML = "Alexis: 073712924, alexis@gmail.com";
                }
                matchDiv.appendChild(match_header);
            }

            let backBtn = document.createElement("button");
            backBtn.setAttribute("class", "historyBtn");
            backBtn.appendChild(document.createTextNode("Back"));

            backBtn.onclick = function() {
                vm.login(currUsr, currPass);
            }

            div.appendChild(header);
            div.appendChild(matchDiv);
            div.appendChild(backBtn);

        },

        createAccount: function() {

            currentDateNumber = 0;
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
            let ages = ["18-25", "26-35", "35-45", "45-55", "56+"];

            let ageDropdown = document.createElement("select");
            ageDropdown.setAttribute("id", "ageDropdown");

            for (let x in ages) {
                let temp = document.createElement("option");
                temp.setAttribute("id", "ageOption");
                temp.innerHTML = ages[x];
                ageDropdown.appendChild(temp);
            }

            genderAgeDiv.appendChild(genderDiv);
            genderAgeDiv.appendChild(ageDropdown);
            div.appendChild(genderAgeDiv);

            // TEXT INPUT USERNAME, PASSWORD ETC
            for (let inf in accountInfo) {
                let temp = document.createElement("input");
                if (accountInfo[inf] === "Password" ||
                    accountInfo[inf] === "Re-enter Password") {
                    temp.setAttribute("type", "password");
                }
                temp.setAttribute("class", "userLogin");
                temp.setAttribute("id", accountInfo[inf]);
                temp.setAttribute("placeholder", accountInfo[inf]);
                div.appendChild(temp);
            }

            let frwBtn = document.createElement("img");
            frwBtn.setAttribute("src", "/img/loginButton.png");
            frwBtn.setAttribute("class", "forwardButton");
            frwBtn.onclick = function() {
                vm.newAccount.username = document.getElementById("Username").value;
                vm.newAccount.email = document.getElementById("E-mail").value;
                vm.newAccount.password = document.getElementById("Password").value;

                let genderRadios = document.getElementsByName("gender");
                if (genderRadios[0].checked) {
                    vm.newAccount.gender = "male";
                } else vm.newAccount.gender = "female";

                vm.newAccount.agePref = document.getElementById("ageDropdown").value;



                vm.accountCreationVerification();
            };

            div.appendChild(frwBtn);

        },
        accountCreationVerification: function() {
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

        loadingDate: function(loadTime) {
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
            setTimeout(vm.personalQuestions, loadTime, dateQuestions, false);

        },

        readyScreen: function() {

            let div = document.getElementById("loginInfoDiv");
            let successText = document.getElementById("accountCreationSuccessMessage");
            if (successText != null) {
                successText.remove();
            }
            div.innerHTML = "";

            let personalQuestionsText = document.createElement("p");
            personalQuestionsText.innerHTML = "Date: " + currentDateNumber;
            //currentDateNumber += 1;
            personalQuestionsText.setAttribute("class", "dateFont");
            personalQuestionsText.style.fontSize = "900%";
            div.appendChild(personalQuestionsText);

            let ready = document.createElement("p");
            ready.innerHTML = "Ready?";
            ready.setAttribute("class", "dateFont");
            ready.style.fontSize = "400%";
            div.appendChild(ready);

            socket.on('timerStartedUser', function() {
                let timerReady = document.createElement("p");
                timerReady.innerHTML = "Timer Started :)";
                timerReady.setAttribute("class", "dateFont");
                timerReady.style.fontSize = "400%";
                div.appendChild(timerReady);
            })



            let frwBtn = document.createElement("img");
            frwBtn.setAttribute("src", "/img/loginButton.png");
            frwBtn.setAttribute("class", "forwardButton");
            frwBtn.onclick = function() {
                vm.nexttableshowing();
            };

            div.appendChild(frwBtn);
        },
        myLoop: function(i) {

            setTimeout(function() {
                socket.emit('timerStartedUser');
                socket.on('userTimerReturn', function(startedBool) {
                    if (startedBool == true && vm.waiting) {
                        vm.waiting = false;
                        vm.loadingDate(12000); //Hårdkoda till 300 000 för 5 min
                    }
                })
                if (--i) vm.myLoop(i); //  decrement i and call myLoop again if i > 0
            }, 3000)
        },


        personalQuestions: function(questions, personalQ) {

            let currentQuestion = 0;

            let div = document.getElementById("loginInfoDiv");
            div.innerHTML = "";

            let personalQuestionsText = document.createElement("h2");
            personalQuestionsText.innerHTML = "Personal Questions";
            personalQuestionsText.style.fontSize = "300%";
            div.appendChild(personalQuestionsText);

            let questionsDiv = document.createElement("div");
            div.appendChild(questionsDiv);



            let qFunc = function() {
                questionsDiv.innerHTML = "";
                let question = document.createElement("h3");
                question.innerHTML = questions[currentQuestion];
                question.style.fontSize = "250%";

                currentQuestion++;
                questionsDiv.appendChild(question);
            }
            qFunc();

            let boxesDiv = document.createElement("div");
            boxesDiv.setAttribute("class", "boxesDiv");

            let heartAnswerInt = 0;
            /// CREATES 10 HEARTS. CONTAINS FUNCTION FOR COLORING HEARTS 
            for (let i = 0; i < 10; i++) {
                let box = document.createElement("div");
                box.setAttribute("class", "heart");
                box.setAttribute("id", i);
                box.setAttribute("value", "" + i);
                boxesDiv.appendChild(box);
                box.onclick = function() {
                    heartAnswerInt = 0;
                    for (let k = 0; k < 10; k++) {
                        let current = document.getElementById(k);
                        if (parseInt(this.id) >= k) {
                            current.style.backgroundColor = "red";
                            heartAnswerInt++;
                        } else {
                            current.style.backgroundColor = "lightgrey";
                        }
                    }
                }
            }

            div.appendChild(boxesDiv);
            let personalDesc = [];
            let givenRatings = [];

            let frwBtn = document.createElement("img");
            frwBtn.setAttribute("src", "/img/loginButton.png");
            frwBtn.setAttribute("class", "forwardButton");
            frwBtn.onclick = function() {
                /// If questions are PERSONAL
                if (personalQ) personalDesc.push(heartAnswerInt);
                else givenRatings.push(heartAnswerInt);


                if (questions.length > currentQuestion) {
                    for (let k = 0; k < 10; k++) {
                        let current = document.getElementById(k);
                        current.style.backgroundColor = "lightgrey";
                    }
                    qFunc();

                }
                /// THIS ELSE IS FOR: DOCUMENTING NEWLY CREATED ACCOUNTS
                else if (personalQ) {
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
                    if (currentDateNumber == 0) {
                        currentDateNumber = 1;
                        location.reload();
                    }
                    if (currentDateNumber > 3) vm.contantInfoShareScreen();
                    else vm.readyScreen();
                }
                /// THIS ELSE IS FOR: DOCUMENTING GIVEN RATINGS
                else {
		    socket.emit('getUserFromIdContact', currentUserId, function(me) {
                        currentUserObject = me;
                    });
		    
                    socket.emit('getDaters', function(allDaters) {
			/// set recieived rating to person im seeing
			var give = false;
			var rec = false;
			
                        for (let i = 0; i < allDaters.length; i++) {
                            if (allDaters[i].id == currentUserId && give == false) {
                                allDaters[i].give.push(givenRatings);
				give = true;
                            }
			    
                            if (allDaters[i].id == currentUserObject.history[date] && rec == false) {
                                allDaters[i].recieved.push(givenRatings);
				date++;
				rec = true;
                            }
			    if(give && rec){
				break;
			    }
                        }
                        socket.emit('setDaters', allDaters);
			
                    });

                    vm.functionInputDate();
                }
            };
            div.appendChild(frwBtn);
        },

        nexttableshowing: function(choosentable) {
            let div = document.getElementById("loginInfoDiv");
            div.innerHTML = "";

            let tableDiv = document.createElement("div");
            tableDiv.setAttribute("class", "tableDiv");

            for (let i = 0; i < tableList.length; i++) {
                if (tableList[i][1].name === currentUserObject.name || tableList[i][2].name === currentUserObject.name) {
                    tableNr = tableList[i][0];
                    break;
                }
            }
            for (let i = 1; i < 11; i++) {
                if (tableNr == i) {
                    let choosentable = document.createElement("div");
                    choosentable.setAttribute("class", "choosentable");
                    choosentable.setAttribute("id", i);
                    var text = document.createTextNode(i);
                    choosentable.style.fontSize = "400%";
                    choosentable.appendChild(text);
                    tableDiv.appendChild(choosentable);

                } else {
                    let table = document.createElement("div");
                    table.setAttribute("class", "table");
                    table.setAttribute("id", i);
                    var text = document.createTextNode(i);
                    table.style.fontSize = "400%";
                    table.appendChild(text);
                    tableDiv.appendChild(table);
                }

            }
            let frwBtn = document.createElement("img");
            frwBtn.setAttribute("src", "/img/loginButton.png");
            frwBtn.setAttribute("class", "forwardButton");

            frwBtn.onclick = function() {
                //frwBtn.setAttribute("src", "/img/waitscreen.png");
                div.removeChild(frwBtn);
                let loadingDivHolder = document.createElement("div");
                loadingDivHolder.setAttribute("class", "spinner");
                let div1 = document.createElement("div");
                let div2 = document.createElement("div");
                let div3 = document.createElement("div");
                let div4 = document.createElement("div");
                let div5 = document.createElement("div");
                div1.setAttribute("class", "rect1");
                div2.setAttribute("class", "rect2");
                div3.setAttribute("class", "rect3");
                div4.setAttribute("class", "rect4");
                div5.setAttribute("class", "rect5");
                loadingDivHolder.appendChild(div1);
                loadingDivHolder.appendChild(div2);
                loadingDivHolder.appendChild(div3);
                loadingDivHolder.appendChild(div4);
                loadingDivHolder.appendChild(div5);
                div.appendChild(loadingDivHolder);
                socket.emit('userReady');
                vm.waiting = true;
                vm.myLoop(500);
            };


            div.appendChild(tableDiv);
            div.appendChild(frwBtn);

        },


        contantInfoShareScreen: function() {
	    matcharr.push(currentUserObject.name);
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
            let matchesFunc = function() {
                matchesDiv.innerHTML = "";
                let match = document.createElement("h3");
                match.innerHTML = matches[matchnumber].name;
                match.style.fontSize = "250%";

                matchnumber++;
                matchesDiv.appendChild(match);
            }



            let heartbuttom = document.createElement("img");
            heartbuttom.setAttribute("src", "/img/heart.png");
            heartbuttom.setAttribute("class", "heartButton");

            heartbuttom.onclick = function() {
                if (matchnumber < currentUserObject.history.length) {
                    matcharr.push(matches[matchnumber - 1].name);
                    matchesFunc();
                } else {
                    matcharr.push(matches[matchnumber - 1].name);
		    socket.emit('matchingDone', matcharr);
		    vm.waitingScreen(500);	
                }
            };

            let nobuttom = document.createElement("img");
            nobuttom.setAttribute("src", "/img/cross.jpg");
            nobuttom.setAttribute("class", "noButton");
            nobuttom.onclick = function() {

                if (matchnumber < currentUserObject.history.length) {
                    matchesFunc();
                } else {
		    socket.emit('matchingDone', matcharr);
                    //vm.successmatchscreen();
		    vm.waitingScreen(500);
                }

            };


            matchesFunc();
            div.appendChild(heartbuttom);
            div.appendChild(nobuttom);
        },

	waitingScreen: function(i){
	    var count = 1;
	    let div = document.getElementById("loginInfoDiv");
	    div.innerHTML = "";
	    let h1 = document.createElement("h1");
	    h1.style.fontSize = "300%";
	    h1.innerHTML = "";
            div.appendChild(h1);
	    function myLoop () {
		setTimeout(function () {
		    socket.emit('checkReadyUsers')
		    socket.on('checkReadyUsersReturn', function(readyAmount){
			h1.innerHTML = ('Daters done: ' + readyAmount + ' / ' + tableList.length*2);
			if(readyAmount >= tableList.length*2){
			    socket.emit('getMatches', currentUserObject.name);
			    socket.on('returnGetMatches', function(returnedMatches){
				matcharr = returnedMatches;
			    });

			    
			    cont = false;
			    vm.successmatchscreen();
			}
		    });
		    if(cont){
			myLoop();
		    }
		    
		}, 1000);
	    }


	    myLoop(); 
	},
	
        successmatchscreen: function() {
            if(currentUserObject.name == matcharr[0]) {
		matcharr.splice(0, 1);
            }
            let div = document.getElementById("loginInfoDiv");
            div.innerHTML = "";
            var numberofmatches = matcharr.length;
            let nummatch = 0;

	    if(numberofmatches == 0){
		let successmatch = document.createElement("p");
		successmatch.innerHTML = "Sadly no matches for you!";
		successmatch.style.fontSize = "300%";
		div.appendChild(successmatch);
	    }else{
		let successmatch = document.createElement("p");
		successmatch.innerHTML = "Congrats, Here are youre matches:";
		successmatch.style.fontSize = "300%";
		div.appendChild(successmatch);



		let successmatchDiv = document.createElement("div");
		successmatchDiv.setAttribute("class", "successmatchDiv");

		for (nummatch; nummatch < numberofmatches; nummatch++) {
                    let match = document.createElement("div");
                    match.setAttribute("class", "match");
                    let text = document.createTextNode(matcharr[nummatch]);
                    match.appendChild(text);
                    successmatchDiv.appendChild(match)

		}

		div.appendChild(successmatchDiv);
	    }

            let frwBtn = document.createElement("img");
            frwBtn.setAttribute("src", "/img/loginButton.png");
            frwBtn.setAttribute("class", "forwardButton");

            frwBtn.onclick = function() {

                vm.endingscreen();
            };

            div.appendChild(frwBtn);

        },



        endingscreen: function() {

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
        functionInputDate: function() {
            let div = document.getElementById("loginInfoDiv");
            div.innerHTML = "";

            let personalQuestionsText = document.createElement("h2");
            personalQuestionsText.innerHTML = "Personal Questions";
            personalQuestionsText.style.fontSize = "300%";
            div.appendChild(personalQuestionsText);

            let InputText = document.createElement("h3");
            InputText.innerHTML = "Any other input on the date?";
            InputText.setAttribute("class", "dateFont");
            InputText.style.fontSize = "200%";

            div.appendChild(InputText);


            let inputTextField = document.createElement("textarea");
            inputTextField.setAttribute("type", "textarea");
            inputTextField.setAttribute("id", "inputDate");
            inputTextField.setAttribute("rows", "4");
            inputTextField.setAttribute("cols", "20");
            div.appendChild(inputTextField);




            let frwBtn = document.createElement("img");
            frwBtn.setAttribute("src", "/img/loginButton.png");
            frwBtn.setAttribute("class", "forwardButton");
            frwBtn.onclick = function() {
                var textField = document.getElementById("inputDate").value;
                socket.emit('getDaters', function(allDaters) {
                    for (let i = 0; i < allDaters.length; i++) {
                        if (allDaters[i].id == currentUserId) {
                            let userTMP = allDaters[i];
                            allDaters[i].other = inputTextField.value;
                            socket.emit('setDaters', allDaters);
                        }
                    }
                })

                if (currentDateNumber > 3) vm.contantInfoShareScreen();
                else vm.readyScreen();

            }
            div.appendChild(frwBtn);
        }
    }
});
