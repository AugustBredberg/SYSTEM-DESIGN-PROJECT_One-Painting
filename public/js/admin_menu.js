var socket = io();

let tableList = [];
let userList = [];
let removedUsers = [];

let compareUser = null;

let selectedTable = 0;
let eventcode = "";

let SE_datersReady = document.createElement("p");
let SE_timer = document.createElement("p");
let SE_userInfo = document.getElementById("wrapper");
let SE_userInfoText = document.createElement("div");




function updateUsers(){
    socket.emit('getDaters', function(daters){
	vm_users.users = daters;
    });
}

setInterval(function() {
    updateUsers();
}, 1000);




const vm_menu = new Vue({

    el: '#eventInfo',
    data: {
	users: daters,
	timer: {minutes:00, seconds:00},
	dateNum: 1,
	i: 12,
	timeout: 0,
	eventOngoing: false,
    },
    methods:{
        createEvent: function(){
            let eventCode = document.getElementById("eventCode");	    
	    
            if(this.eventOngoing == false){
                this.eventOngoing = true;
                document.getElementById("eventButton").innerHTML = "Stop Event";
                let eventCode = document.getElementById("eventCode");
                var code = vm_users.makeid(8)
                eventcode = code;
                document.getElementById("eventCode").innerHTML = code;
                socket.emit('EventStarted', code);
		socket.emit('setEventcode', code);
            }
            else if(this.eventOngoing = true){
                this.eventOngoing = false;
                document.getElementById("eventButton").innerHTML = "Create Event";

                socket.emit('EventStopped', document.getElementById("eventCode").innerHTML);
                document.getElementById("eventCode").innerHTML = "";
            }
        },
        cancelEvent: function(){
            document.getElementById("eventCode").innerHTML = "";
        },

        startTimer: function(){


            if(this.i == 0){
                
                this.i = 12;
		this.dateNum += 1;
		vm_menu.startEvent(null);
            }
            this.i--;
            var minute = Math.floor(this.i/60);

            var second = this.i % 60;
            this.timer.minutes = minute;
            this.timer.seconds = second;
            SE_timer.innerHTML = this.timer.minutes + ' : ' + this.timer.seconds;



            if(this.i == -1){
                this.i = 0;
            }
            else {

		if(this.i != 0) {   //hard coded

		    timeout = setTimeout(vm_menu.startTimer, 1000);
		}
		else{
		    socket.emit('timerStopped');
		    socket.emit('resetReadyUsers');
		}
            }

        },

	stopTimer: function(){
            socket.emit('timerStopped');
            this.i = 0;
            var minute = Math.floor(this.i/60);

            var second = this.i % 60;
            this.timer.minutes = minute;
            this.timer.seconds = second;
            SE_timer.innerHTML = this.timer.minutes + ' : ' + this.timer.seconds;
	    clearTimeout(timeout);
	    
	    
	    
	},
	
        startEvent: function(listOfUsers) {

            blankArea("wrapper");
	    
	    if(listOfUsers == null){
	        vm_users.getUsers();
	    }
	    socket.emit('setDateSetup', tableList);

	    console.log(tableList[0][1].history);
	    
	    let SE_EditList = document.getElementById("wrapper");

	    let SE_Left = document.createElement("div");
	    SE_Left.setAttribute("id","left");
	    SE_EditList.appendChild(SE_Left);

	    let SE_Time = document.createElement("div");
	    SE_Time.setAttribute("id","seTime");
	    SE_EditList.appendChild(SE_Time);
	    
	    displayPairs(tableList, false);
            
	    
	    
	    let btnEdit = document.createElement("button");
	    btnEdit.appendChild(document.createTextNode("Edit"));
	    SE_Time.appendChild(btnEdit);

	    btnEdit.onclick = function(){
		edit();
	    }
	    
            //let SE_sessionInfo = document.getElementById("wrapper");
            let SE_dateNum = document.createElement("p");
            SE_dateNum.appendChild(document.createTextNode('Date: ' + this.dateNum));

            SE_datersReady.appendChild(document.createTextNode('Daters ready: ' + '0' + ' / ' + vm_users.users.length))
            vm_menu.myLoop(500);


            let SE_textBox = document.createElement("p");
            SE_textBox.appendChild(document.createTextNode('Coming up'));
            let SE_timerButton = document.createElement("button");
	    let SE_stopTimerButton = document.createElement("button");

            SE_timerButton.appendChild(document.createTextNode("Start timer"));
	    SE_stopTimerButton.appendChild(document.createTextNode("Stop timer"));

	    SE_timer.appendChild(document.createTextNode(""));
            SE_Left.appendChild(SE_timer);
            SE_timer.setAttribute("class", "timer");
            SE_timerButton.onclick = function() {

                socket.emit('timerStarted');

                vm_menu.startTimer();
                SE_dateNum.innerHTML = 'Date: ' + vm_menu.dateNum;
            }
	    SE_stopTimerButton.onclick = function() {

                vm_menu.stopTimer();

            }
            SE_Left.appendChild(SE_datersReady);
	    SE_Left.appendChild(SE_dateNum);
            SE_Left.appendChild(SE_textBox);
            SE_Left.appendChild(SE_timerButton);
	    SE_Left.appendChild(SE_stopTimerButton);


            SE_dateNum.setAttribute("class", "timer");
            SE_textBox.setAttribute("class", "timer");
            SE_timerButton.setAttribute("class", "timerbutton");
	    SE_stopTimerButton.setAttribute("class", "stopTimerbutton");
            SE_dateNum.setAttribute("id", "toHideOnViewNum");
            SE_textBox.setAttribute("id", "toHideOnViewText");
            SE_timer.setAttribute("id", "toHideOnViewtimer");
            SE_timerButton.setAttribute("id", "toHideOnViewButton");
	    SE_stopTimerButton.setAttribute("id", "toHideOnViewButton");


        },

        myLoop: function(i) {

            setTimeout(function () {
                socket.emit('checkReadyUsers')
                socket.on('checkReadyUsersReturn', function(readyAmount){
                    SE_datersReady.innerHTML = ('Daters ready: ' + readyAmount + ' / ' + vm_users.users.length);


                })
                if (--i) vm_menu.myLoop(i);      //  decrement i and call myLoop again if i > 0
            }, 1000)
        },
        hoverOverUser: function(userID){
            SE_userInfoText.setAttribute("class", "userInfo");
            SE_userInfoText.setAttribute("id", "userInfoText");

            let personalInfo = document.createElement("h1");
            personalInfo.appendChild(document.createTextNode("Personal Info:"));

	    let question1 = document.createElement("p");
            question1.appendChild(document.createTextNode("Answer to question 1: " + userID.desc[0]));
            let question2 = document.createElement("p");
            question2.appendChild(document.createTextNode("Answer to question 2: " + userID.desc[1]));
            let question3 = document.createElement("p");
            question3.appendChild(document.createTextNode("Answer to question 3: " + userID.desc[2]));

	    let ratingsReceived = document.createElement("h1");
            ratingsReceived.appendChild(document.createTextNode("Ratings given:"))

	    let received1 = document.createElement("p");
            received1.appendChild(document.createTextNode("Answer to question 1: " + userID.give[0]));
            let received2 = document.createElement("p");
            received2.appendChild(document.createTextNode("Answer to question 2: " + userID.give[1]));
            let received3 = document.createElement("p");
            received3.appendChild(document.createTextNode("Answer to question 3: " + userID.give[2]));

	    let ratingsGiven = document.createElement("h1");
            ratingsGiven.appendChild(document.createTextNode("Ratings recieved:"))

	    let given1 = document.createElement("p");
            given1.appendChild(document.createTextNode("Answer to question 1: " + userID.recieved[0]));
            let given2 = document.createElement("p");
            given2.appendChild(document.createTextNode("Answer to question 2: " + userID.recieved[1]));
            let given3 = document.createElement("p");
            given3.appendChild(document.createTextNode("Answer to question 3: " + userID.recieved[2]));

            let otherInput = document.createElement("h1");
            otherInput.appendChild(document.createTextNode("Other input:"))

            let other1 = document.createElement("p");
            other1.innerHTML = userID.other;
	    
            SE_userInfoText.appendChild(personalInfo);
            SE_userInfoText.appendChild(question1);
            SE_userInfoText.appendChild(question2);
            SE_userInfoText.appendChild(question3);
            SE_userInfoText.appendChild(ratingsReceived);
            SE_userInfoText.appendChild(received1);
            SE_userInfoText.appendChild(received2);
            SE_userInfoText.appendChild(received3);
            SE_userInfoText.appendChild(ratingsGiven);
            SE_userInfoText.appendChild(given1);
            SE_userInfoText.appendChild(given2);
            SE_userInfoText.appendChild(given3);
            SE_userInfoText.appendChild(otherInput);
            SE_userInfoText.appendChild(other1);

            SE_userInfo.appendChild(SE_userInfoText);
        },


    }
})
const vm_users = new Vue({
    el: '#userList',
    data: {
        users: [],
        userID: "",
	button: "button",
    },
    methods:{
	confirmRemove: function(userID){
	    let btn = document.getElementById("button"+userID.id);
	    if(userID === compareUser){
		vm_users.removeUser(userID);
		btn.innerHTML = "X";
	    }else{
		if(compareUser !== null || this.users.indexOf(compareUser) !== -1){
		    
		    let btn2 = document.getElementById("button"+compareUser.id);
		    if(btn2 !== null){
			btn2.innerHTML = "X";
		    }
		}
		compareUser = userID;
		
		btn.innerHTML = "Are you sure?";
	    }
	},

        removeUser: function(userID) {
            this.users.splice(this.users.indexOf(userID), 1);
            socket.emit('setDaters',this.users);
        },
        makeid: function(length) {
            var result = '';
            var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var charactersLength = characters.length;
            for (var i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
        },

        getUsers: function(){
	    updateUsers();
	    tableList = [];
	    
	    var j = 1;
	    var girls = [];
	    var boys = [];

	    for(var i = 0; i < this.users.length; i++){
		if(this.users[i].gender === 'female'){
		    girls.push(this.users[i]);
		}
		else if(this.users[i].gender === 'male'){
		    boys.push(this.users[i]);
		}
	    }

	    while(boys.length != 0 && girls.length != 0){
		var match = 0;
		var boyIndex = 0;
		for(var i = 0; i<boys.length; i++){
		    tempMatch = calculateMatch([1, girls[0], boys[i]]);
		    if(tempMatch > match &&
		       getOccurrence(girls[0].history, boys[i].id) < 1){
			boyIndex = i;
			match = tempMatch;
		    }
		}

		var temp = [j, girls[0], boys[boyIndex]];
		tableList.push(temp);
		j++;
		boys.splice(boyIndex, 1);
		girls.splice(0, 1);
	    }

	    if(boys.length != 0){
		var str = "Couldn't find a match for:\n";
		for(var i = 0; i<boys.length; i++){
		    str += boys[i].name + "\n";
		    this.users.splice(this.users.indexOf(boys[i]), 1);
		}
		alert(str);
	    }
	    
	    if(girls.length != 0){
		var str = "Couldn't find a match for:\n";
		for(var i = 0; i<girls.length; i++){
		    str += girls[i].name + "\n";
		    this.users.splice(this.users.indexOf(girls[i]), 1);
		}
		alert(str);
	    }
        }
    }
})

function edit(changedUsers){
    var checkedUsers = [];
    var usersTemp = JSON.parse(JSON.stringify(tableList));
    if(changedUsers != null){
	for(var i = 0; i < changedUsers.length; i++){
	    usersTemp[changedUsers[i][0]-1] = changedUsers[i];
	}
    }
    blankArea("wrapper");
    
    let wrapper = document.getElementById("wrapper");
    
    let SE_Left = document.createElement("div");
    SE_Left.setAttribute("id","left");
    wrapper.appendChild(SE_Left);
    
    let SE_buttons = document.createElement("div");
    SE_buttons.setAttribute("id","seTime");
    wrapper.appendChild(SE_buttons);
    
    displayPairs(usersTemp, true);

    let btnCompare = document.createElement("button");
    btnCompare.appendChild(document.createTextNode("Compare and change"));

    let btnSave = document.createElement("button");
    btnSave.appendChild(document.createTextNode("Save and exit"));

    let btnDiscard = document.createElement("button");
    btnDiscard.appendChild(document.createTextNode("Discard changes"));

    SE_Left.appendChild(btnCompare);
    SE_Left.appendChild(btnSave);
    SE_Left.appendChild(btnDiscard);

    btnCompare.onclick = function(){
	for(var i = 0; i <tableList.length; i++){
	    let temp = document.getElementById("li"+i);
	    if(temp.checked){
		checkedUsers.push(JSON.parse(JSON.stringify(tableList[i])));
	    }
	}
	compareAndChange(checkedUsers);
    }

    btnSave.onclick = function(){
	tableList = JSON.parse(JSON.stringify(usersTemp));
	vm_menu.startEvent(tableList);
    }

    btnDiscard.onclick = function(){
	vm_menu.startEvent(tableList);
    }
}

function compareAndChange(checkedUsers){
    blankArea("wrapper");
    let wrapper = document.getElementById("wrapper");
    let SE_Left = document.createElement("div");
    SE_Left.setAttribute("id","left");
    wrapper.appendChild(SE_Left);

    let SE_Middle = document.createElement("div");
    SE_Middle.setAttribute("id","seTime");
    wrapper.appendChild(SE_Middle);

    let SE_Right = document.createElement("div");
    SE_Right.setAttribute("id","right");
    wrapper.appendChild(SE_Right);

    let SE_Div = document.createElement("div");
    SE_Div.setAttribute("id","div");
    SE_Right.appendChild(SE_Div);
    
    let ul = document.createElement("ul");
    ul.setAttribute("id", "pairsList");
    ul.style.listStyleType = "none";
    for (let i = 0; i < checkedUsers.length; i++){
	let li = document.createElement("li");
	li.appendChild(document.createTextNode(checkedUsers[i][0] +
					       ". " +
					       checkedUsers[i][1].name +
					       " and " +
					       checkedUsers[i][2].name));
	ul.appendChild(li);
    }
    
    //-----------------------------
    
    let tableChooser = document.createElement("div");

    /*
      let label = document.createElement("label");
      label.appendChild(document.createTextNode("Table:"));
      label.setAttribute("for", "select");*/
    
    let select = document.createElement("select");
    select.setAttribute("id", "select");

    for(var i = 0; i < checkedUsers.length; i++){
	let option = document.createElement("option");
	option.setAttribute("value", i);
	option.appendChild(document.createTextNode("Table: " + checkedUsers[i][0]));
	if(i == 0){
	    option.setAttribute("selected", "selected");
	}
	select.appendChild(option);
    }
    
    //tableChooser.appendChild(label);
    tableChooser.appendChild(select);

    //-----------------------------
    
    let woman = document.createElement("div");

    let womanSelect = document.createElement("select");

    for(var i = 0; i < checkedUsers.length; i++){
	let option = document.createElement("option");
	option.setAttribute("value", i);
	option.appendChild(document.createTextNode(checkedUsers[i][1].name));
	if(i == selectedTable){
	    option.setAttribute("selected", "selected");
	}
	womanSelect.appendChild(option);
    }

    let womanHeader = document.createElement("h3");
    womanHeader.setAttribute("id", "womanH3");
    womanHeader.appendChild(document.createTextNode(checkedUsers[0][1].name));

    let womanDescText = document.createElement("h4");
    womanDescText.appendChild(document.createTextNode("Personal questions"));
    
    let womanDesc = document.createElement("ul");
    womanDesc.setAttribute("id", "womanDesc");
    for(var i = 0; i<checkedUsers[0][1].desc.length; i++){
	let womanLi = document.createElement("li");
	womanLi.appendChild(document.createTextNode(checkedUsers[0][1].desc[i]));
	womanDesc.appendChild(womanLi);
    }
    
    let womanGivenText = document.createElement("h4");
    womanGivenText.appendChild(document.createTextNode("Given ratings"));

    let womanGiven = document.createElement("ul");
    womanGiven.setAttribute("id", "womanGiven");
    for(var i = 0; i<checkedUsers[0][1].give.length; i++){
	let womanLi = document.createElement("li");
	womanLi.appendChild(document.createTextNode(checkedUsers[0][1].give[i]));
	womanGiven.appendChild(womanLi);
    }

    let womanRecievedText = document.createElement("h4");
    womanRecievedText.appendChild(document.createTextNode("Recieved ratings"));

    let womanRecieved = document.createElement("ul");
    womanRecieved.setAttribute("id", "womanRecieved");
    for(var i = 0; i<checkedUsers[0][1].recieved.length; i++){
	let womanLi = document.createElement("li");
	womanLi.appendChild(document.createTextNode(checkedUsers[0][1].recieved[i]));
	womanRecieved.appendChild(womanLi);
    }

    woman.appendChild(womanHeader);
    woman.appendChild(womanSelect);
    woman.appendChild(womanDescText);
    woman.appendChild(womanDesc);
    woman.appendChild(womanGivenText);
    woman.appendChild(womanGiven);
    woman.appendChild(womanRecievedText);
    woman.appendChild(womanRecieved);
    
    let man = document.createElement("div");

    let manHeader = document.createElement("h3");
    manHeader.setAttribute("id", "manH3");
    manHeader.appendChild(document.createTextNode(checkedUsers[0][2].name));

    let manSelect = document.createElement("select");

    for(var i = 0; i < checkedUsers.length; i++){
	let option = document.createElement("option");
	option.setAttribute("value", i);
	option.appendChild(document.createTextNode(checkedUsers[i][2].name));
	if(i == selectedTable){
	    option.setAttribute("selected", "selected");
	}
	manSelect.appendChild(option);
    }

    let manDescText = document.createElement("h4");
    manDescText.appendChild(document.createTextNode("Personal questions"));
    
    let manDesc = document.createElement("ul");
    manDesc.setAttribute("id", "manDesc");
    for(var i = 0; i<checkedUsers[0][1].desc.length; i++){
	let manLi = document.createElement("li");
	manLi.appendChild(document.createTextNode(checkedUsers[0][2].desc[i]));
	manDesc.appendChild(manLi);
    }
    
    let manGivenText = document.createElement("h4");
    manGivenText.appendChild(document.createTextNode("Given ratings"));

    let manGiven = document.createElement("ul");
    manGiven.setAttribute("id", "manGiven");
    for(var i = 0; i<checkedUsers[0][1].give.length; i++){
	let manLi = document.createElement("li");
	manLi.appendChild(document.createTextNode(checkedUsers[0][2].give[i]));
	manGiven.appendChild(manLi);
    }

    let manRecievedText = document.createElement("h4");
    manRecievedText.appendChild(document.createTextNode("Recieved ratings"));

    let manRecieved = document.createElement("ul");
    manRecieved.setAttribute("id", "manRecieved");
    for(var i = 0; i<checkedUsers[0][1].recieved.length; i++){
	let manLi = document.createElement("li");
	manLi.appendChild(document.createTextNode(checkedUsers[0][2].recieved[i]));
	manRecieved.appendChild(manLi);
    }

    man.appendChild(manHeader);
    man.appendChild(manSelect);
    man.appendChild(manDescText);
    man.appendChild(manDesc);
    man.appendChild(manGivenText);
    man.appendChild(manGiven);
    man.appendChild(manRecievedText);
    man.appendChild(manRecieved);

    //-----------------------------

    let matchPrecent = document.createElement("h1");
    matchPrecent.appendChild(document.createTextNode("This table is a " + calculateMatch(checkedUsers[selectedTable]) + "% match"));
    
    //-----------------------------

    let btnConfirm = document.createElement("button");
    btnConfirm.appendChild(document.createTextNode("Confirm"));

    //-----------------------------

    SE_Middle.appendChild(ul);
    SE_Left.appendChild(matchPrecent);
    SE_Left.appendChild(tableChooser);
    SE_Div.appendChild(woman);
    SE_Div.appendChild(man);
    SE_Left.appendChild(btnConfirm);

    select.onchange = function(){
	selectedTable = select.options[select.selectedIndex].value;
	
	
	changeWoman(checkedUsers);
	changeMan(checkedUsers);

	matchPrecent.innerHTML = "This table is a " + calculateMatch(checkedUsers[selectedTable]) + "% match";
    }

    womanSelect.onchange = function(){
	var temporary = checkedUsers[selectedTable][1];
	checkedUsers[selectedTable][1] = checkedUsers[womanSelect.options[womanSelect.selectedIndex].value][1];
	checkedUsers[womanSelect.options[womanSelect.selectedIndex].value][1] = temporary;
	changeWoman(checkedUsers);
	matchPrecent.innerHTML = "This table is a " + calculateMatch(checkedUsers[selectedTable]) + "% match";
    }
    
    manSelect.onchange = function(){
	var temporary = checkedUsers[selectedTable][2];
	checkedUsers[selectedTable][2] = checkedUsers[manSelect.options[manSelect.selectedIndex].value][2];
	checkedUsers[manSelect.options[manSelect.selectedIndex].value][2] = temporary;

	changeMan(checkedUsers);

	matchPrecent.innerHTML = "This table is a " + calculateMatch(checkedUsers[selectedTable]) + "% match";
    }

    btnConfirm.onclick = function(){
	edit(checkedUsers);
    }
}

function displayPairs(users, bool){
    let SE_EditList = document.getElementById("seTime");
    let SE_Userlist = document.createElement("ol");
    for (let i = 0; i < users.length; i++){
        let SE_UserInList = document.createElement("li");
	if(bool){
	    let liCheckbox = document.createElement("input");
	    liCheckbox.setAttribute("type", "checkbox");
	    liCheckbox.setAttribute("id", "li"+i);
	    SE_UserInList.appendChild(liCheckbox);
	}
        let SE_user1 = document.createElement("span");
        let SE_user2 = document.createElement("span");
        SE_user1.setAttribute("class", "user");
        SE_user2.setAttribute("class", "user");
        SE_user1.setAttribute("id", users[i][1].id);
        SE_user2.setAttribute("id", users[i][2].id);
        SE_user1.appendChild(document.createTextNode(users[i][1].name));
        SE_user2.appendChild(document.createTextNode(users[i][2].name));

        SE_UserInList.appendChild(SE_user1);
        SE_UserInList.appendChild(document.createTextNode(" And "));
        SE_UserInList.appendChild(SE_user2);
        SE_Userlist.appendChild(SE_UserInList);
	
        SE_user1.onmouseover = function (){
	    updateUsers();
            vm_menu.hoverOverUser(users[i][1]);
            document.getElementById('userInfoText').style.visibility = "visible";
        }
        SE_user1.onmouseleave = function (){
            SE_userInfoText.innerHTML = "";
            document.getElementById('userInfoText').style.visibility = "hidden";

        }
        SE_user2.onmouseover = function (){
	    updateUsers();
            vm_menu.hoverOverUser(users[i][2]);
            document.getElementById('userInfoText').style.visibility = "visible";
        }
        SE_user2.onmouseleave = function (){
            SE_userInfoText.innerHTML = "";
            document.getElementById('userInfoText').style.visibility = "hidden";
        }

    }
    SE_EditList.appendChild(SE_Userlist);

}

function changeWoman(checkedUsers){
    blankArea("womanH3");
    blankArea("womanDesc");
    blankArea("womanGiven");
    blankArea("womanRecieved");

    let womanHeader = document.getElementById("womanH3");
    womanHeader.appendChild(document.createTextNode(checkedUsers[selectedTable][1].name));
    let womanDesc = document.getElementById("womanDesc");
    for(var i = 0; i<checkedUsers[0][1].desc.length; i++){
	let womanLi = document.createElement("li");
	womanLi.appendChild(document.createTextNode(checkedUsers[selectedTable][1].desc[i]));
	womanDesc.appendChild(womanLi);
    }
    let womanGiven = document.getElementById("womanGiven");
    for(var i = 0; i<checkedUsers[0][1].give.length; i++){
	let womanLi = document.createElement("li");
	womanLi.appendChild(document.createTextNode(checkedUsers[selectedTable][1].give[i]));
	womanGiven.appendChild(womanLi);
    }
    let womanRecieved = document.getElementById("womanRecieved");
    for(var i = 0; i<checkedUsers[0][1].recieved.length; i++){
	let womanLi = document.createElement("li");
	womanLi.appendChild(document.createTextNode(checkedUsers[selectedTable][1].recieved[i]));
	womanRecieved.appendChild(womanLi);
    }

    listPairs(checkedUsers);
}

function changeMan(checkedUsers){
    blankArea("manH3");
    blankArea("manDesc");
    blankArea("manGiven");
    blankArea("manRecieved");

    
    let manHeader = document.getElementById("manH3");
    manHeader.appendChild(document.createTextNode(checkedUsers[selectedTable][2].name));
    let manDesc = document.getElementById("manDesc");
    for(var i = 0; i<checkedUsers[0][1].desc.length; i++){
	let manLi = document.createElement("li");
	manLi.appendChild(document.createTextNode(checkedUsers[selectedTable][2].desc[i]));
	manDesc.appendChild(manLi);
    }
    let manGiven = document.getElementById("manGiven");
    for(var i = 0; i<checkedUsers[0][1].give.length; i++){
	let manLi = document.createElement("li");
	manLi.appendChild(document.createTextNode(checkedUsers[selectedTable][2].give[i]));
	manGiven.appendChild(manLi);
    }
    let manRecieved = document.getElementById("manRecieved");
    for(var i = 0; i<checkedUsers[0][1].recieved.length; i++){
	let manLi = document.createElement("li");
	manLi.appendChild(document.createTextNode(checkedUsers[selectedTable][2].recieved[i]));
	manRecieved.appendChild(manLi);
    }

    listPairs(checkedUsers);
}

function listPairs(checkedUsers){
    blankArea("pairsList");
    let ul = document.getElementById("pairsList");
    for (let i = 0; i < checkedUsers.length; i++){
	let li = document.createElement("li");
	li.appendChild(document.createTextNode(checkedUsers[i][0] +
					       ". " +
					       checkedUsers[i][1].name +
					       " and " +
					       checkedUsers[i][2].name));
	ul.appendChild(li);
    }
}

function blankArea(id) {
    let area = document.getElementById(id);
    area.innerHTML = ""; 
}

function calculateMatch(table){
    let girl = table[1];
    let boy = table[2];

    let girlPersonal = girl.desc;
    let girlGive = girl.give;
    let girlRec = girl.recieved;
    
    let boyPersonal = boy.desc;
    let boyGive = boy.give;
    let boyRec = boy.recieved;

    let total = 0;

    for(let i = 0; i<boyPersonal.length;i++){
	total += boyPersonal[i] - girlPersonal[i];
    }

    for(let i = 0; i<boyGive.length;i++){
	total += boyGive[i] - girlGive[i];
    }

    for(let i = 0; i<boyRec.length;i++){
	total += boyRec[i] - girlRec[i];
    }

    return 100 - Math.abs(total);
}

function getOccurrence(array, value) {
    var count = 0;
    array.forEach((v) => (v === value && count++));
    return count;
}
