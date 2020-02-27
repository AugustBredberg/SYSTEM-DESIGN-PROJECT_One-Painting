'use strict';
var socket = io();


let SE_timer = document.createElement("p");
let SE_userInfo = document.getElementById("wrapper");
let SE_userInfoText = document.createElement("div");
let selectedTable = 0;


const vm_menu = new Vue({
        el: '#eventInfo',
        data: {
        users: [],
        timer: {minutes:0, seconds:0},
        dateNum: 1,
        i: 300,
        code: "",
        eventOngoing: false,
    },
    methods:{
        createEvent: function(){

            if(this.eventOngoing == false){
                this.eventOngoing = true;
                document.getElementById("eventButton").innerHTML = "Stop Event";
                console.log('Eventcode generated');
                let eventCode = document.getElementById("eventCode");
                var code = vm_users.makeid(8)
                document.getElementById("eventCode").innerHTML = code;
                console.log('adding eventcode' + code);
                socket.emit('EventStarted', code);
            }
            else if(this.eventOngoing = true){
                this.eventOngoing = false;
                document.getElementById("eventButton").innerHTML = "Create Event";

                console.log('removing eventcode' + document.getElementById("eventCode").innerHTML);
                socket.emit('EventStopped', document.getElementById("eventCode").innerHTML);
                document.getElementById("eventCode").innerHTML = "";
            }

            /*let stopEvent = document.getElementById("stopButton")
            var stopButton = document.createElement("button");
            stopButton.innerHTML = "Stop Event";
            stopEvent.appendChild(stopButton);*/
        },
        cancelEvent: function(){
            console.log('Event canceled')
            document.getElementById("eventCode").innerHTML = "";
        },
        startTimer: function(){
            var minute = Math.floor(this.i/60);

            var second = this.i % 60;
            console.log("Minutes: " + minute + "seconds: " + second)
            this.timer.minutes = minute;
            this.timer.seconds = second;
            SE_timer.innerHTML = this.timer.minutes + ' : ' + this.timer.seconds;


            this.i--;
            if(this.i == -1){
                this.i = 0;
            }
            else {

                setTimeout(vm_menu.startTimer, 1000);
            }

        },

        startEvent: function(listOfUsers) {
            console.log('Event started');
            blankArea("wrapper");

	    if(listOfUsers != null){
		users = listOfUsers;
	    }else{
	        users = vm_users.getUsers();
	    }
            console.log(users);

	    displayPairs(users, false);
	    let SE_EditList = document.getElementById("wrapper");
            
	    let btnEdit = document.createElement("button");
	    btnEdit.appendChild(document.createTextNode("Edit"));
	    SE_EditList.appendChild(btnEdit);

	    btnEdit.onclick = function(){
		users = edit();
	    }
	    
            //let SE_sessionInfo = document.getElementById("wrapper");
            let SE_dateNum = document.createElement("p");
            SE_dateNum.appendChild(document.createTextNode('Date: ' + this.dateNum));
            let SE_textBox = document.createElement("p");
            SE_textBox.appendChild(document.createTextNode('Coming up'));
            let SE_timerButton = document.createElement("button");
            SE_timerButton.appendChild(document.createTextNode("Start timer"));

            SE_EditList.appendChild(SE_timer);
            SE_timer.setAttribute("class", "timer");
            SE_timerButton.onclick = function() {
                vm_menu.startTimer();
            }
            /*SE_sessionInfo.appendChild(SE_timer);*/
	    SE_EditList.appendChild(SE_dateNum);
            SE_EditList.appendChild(SE_textBox);
            SE_EditList.appendChild(SE_timerButton);

            SE_dateNum.setAttribute("class", "timer");
            SE_textBox.setAttribute("class", "timer");
            SE_timerButton.setAttribute("class", "timerbutton");
            SE_dateNum.setAttribute("id", "toHideOnViewNum");
            SE_textBox.setAttribute("id", "toHideOnViewText");
            SE_timer.setAttribute("id", "toHideOnViewtimer");
            SE_timerButton.setAttribute("id", "toHideOnViewButton");

        },
        hoverOverUser: function(userID){
            //console.log(userID);
	    
            //document.getElementById("toHideOnViewNum").style.visibility = "hidden";
            //document.getElementById("toHideOnViewText").style.visibility = "hidden";
            //document.getElementById("toHideOnViewtimer").style.visibility = "hidden";
            //document.getElementById("toHideOnViewButton").style.visibility = "hidden";

            SE_userInfoText.setAttribute("class", "userInfo");
            SE_userInfoText.setAttribute("id", "userInfoText");

            let personalInfo = document.createElement("h3");
            personalInfo.appendChild(document.createTextNode("Personal Info:"));


            SE_userInfoText.appendChild(given3);

            SE_userInfo.appendChild(SE_userInfoText);
        },


    }
})
const vm_users = new Vue({
    el: '#userList',
    data: {
        users: daters,
        userID: "",
	button: "button",
    },
    methods:{
	confirmRemove: function(userID){
	    console.log(userID.id);
	    let btn = document.getElementById("button"+userID.id);
	    btn.innerHTML = "Are you sure?";
	    btn.onclick = function(){
		vm_users.removeUser(userID);
	    }
	},
        removeUser: function(userID){ //This only removes the nametext of the user. Should remove entire user from the users array.	    
            this.users.splice(this.users.indexOf(userID), 1);

        },
        makeid: function(length) {
            var result           = '';
            var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var charactersLength = characters.length;
            for ( var i = 0; i < length; i++ ) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
         }
        return result;
        },
        getUsers: function(){
	    var userList = [];
	    var j = 1;
	    for(var i = 0; i < this.users.length; i++){
		var temp = [j, this.users[i], this.users[i+1]];
		userList.push(temp);
		i++;
		j++;
	    }
            return userList;
        }

    }
})

function edit(changedUsers){
    var users = vm_users.getUsers();
    var checkedUsers = [];
    var usersTemp = users;
    if(changedUsers != null){
	for(var i = 0; i < changedUsers.length; i++){
	    users[changedUsers[i][0]-1] = changedUsers[i];
	}
    }
    
    blankArea("wrapper");
    displayPairs(users, true);

    let wrapper = document.getElementById("wrapper");

    let btnCompare = document.createElement("button");
    btnCompare.appendChild(document.createTextNode("Compare and change"));

    let btnSave = document.createElement("button");
    btnSave.appendChild(document.createTextNode("Save and exit"));

    let btnDiscard = document.createElement("button");
    btnDiscard.appendChild(document.createTextNode("Discard changes"));

    wrapper.appendChild(btnCompare);
    wrapper.appendChild(btnSave);
    wrapper.appendChild(btnDiscard);

    btnCompare.onclick = function(){
	let tableCounter = 1;
	for(var i = 0; i <users.length; i++){
	    let temp = document.getElementById("li"+i);
	    if(temp.checked){
		let tempList = [tableCounter,users[i][1],users[i][2]];
		checkedUsers.push(tempList);
	    }
	    tableCounter++;
	}
	compareAndChange(checkedUsers);
    }

    btnSave.onclick = function(){
	vm_menu.startEvent(users);
    }

    btnDiscard.onclick = function(){
	vm_menu.startEvent(usersTemp);
    }
}

function compareAndChange(checkedUsers){
    blankArea("wrapper");

    let wrapper = document.getElementById("wrapper");
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
    
    let label = document.createElement("label");
    label.appendChild(document.createTextNode("Table:"));
    label.setAttribute("for", "select");
    
    let select = document.createElement("select");
    select.setAttribute("id", "select");

    for(var i = 0; i < checkedUsers.length; i++){
	let option = document.createElement("option");
	option.setAttribute("value", i);
	option.appendChild(document.createTextNode(checkedUsers[i][0]));
	if(i == 0){
	    option.setAttribute("selected", "selected");
	}
	select.appendChild(option);
    }
    
    tableChooser.appendChild(label);
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

    let btnConfirm = document.createElement("button");
    btnConfirm.appendChild(document.createTextNode("Confirm"));

    //-----------------------------

    wrapper.appendChild(ul);
    wrapper.appendChild(tableChooser);
    wrapper.appendChild(woman);
    wrapper.appendChild(man);
    wrapper.appendChild(btnConfirm);

    select.onchange = function(){
	selectedTable = select.options[select.selectedIndex].value;
	
	changeWoman(checkedUsers);
	changeMan(checkedUsers);
    }

    womanSelect.onchange = function(){
	var temporary = checkedUsers[selectedTable][1];
	checkedUsers[selectedTable][1] = checkedUsers[womanSelect.options[womanSelect.selectedIndex].value][1];
	checkedUsers[womanSelect.options[womanSelect.selectedIndex].value][1] = temporary;

	changeWoman(checkedUsers);
    }
    
    manSelect.onchange = function(){
	var temporary = checkedUsers[selectedTable][2];
	checkedUsers[selectedTable][2] = checkedUsers[manSelect.options[manSelect.selectedIndex].value][2];
	checkedUsers[manSelect.options[manSelect.selectedIndex].value][2] = temporary;

	changeMan(checkedUsers);
    }

    btnConfirm.onclick = function(){
	edit(checkedUsers);
    }
}

function displayPairs(users, bool){
    let SE_EditList = document.getElementById("wrapper");
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
            vm_menu.hoverOverUser(SE_user1.id);
            document.getElementById('userInfoText').style.visibility = "visible";
        }
        SE_user1.onmouseleave = function (){
            SE_userInfoText.innerHTML = "";
            document.getElementById('userInfoText').style.visibility = "hidden";
            //document.getElementById("toHideOnViewNum").style.visibility = "visible";
            //document.getElementById("toHideOnViewText").style.visibility = "visible";
            //document.getElementById("toHideOnViewtimer").style.visibility = "visible";
            //document.getElementById("toHideOnViewButton").style.visibility = "visible";

        }
        SE_user2.onmouseover = function (){
            vm_menu.hoverOverUser(SE_user2.id);
            document.getElementById('userInfoText').style.visibility = "visible";
        }
        SE_user2.onmouseleave = function (){
            SE_userInfoText.innerHTML = "";
            document.getElementById('userInfoText').style.visibility = "hidden";
            //document.getElementById("toHideOnViewNum").style.visibility = "visible";
            //document.getElementById("toHideOnViewText").style.visibility = "visible";
            //document.getElementById("toHideOnViewtimer").style.visibility = "visible";
            //document.getElementById("toHideOnViewButton").style.visibility = "visible";
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
