
let SE_timer = document.createElement("p");
let SE_userInfo = document.getElementById("wrapper");
let SE_userInfoText = document.createElement("div");
const vm_menu = new Vue({
    el: '#eventInfo',
    data: {
    users: [],
    timer: {minutes:00, seconds:00},
    dateNum: 1,
    i: 300,
    },
    methods:{
        createEvent: function(){
            console.log('Eventcode generated');
            let eventCode = document.getElementById("eventCode");
            document.getElementById("eventCode").innerHTML = "1D10T";

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

        startEvent: function() {
            console.log('Event started');
            blankArea("wrapper");

            users =  vm_users.getUsers();
            console.log(users);
            let SE_EditList = document.getElementById("wrapper");
            let SE_Userlist = document.createElement("ol");
            for (let i = 0; i < users.length-1; i++){
                let SE_UserInList = document.createElement("li");
                let SE_user1 = document.createElement("span");
                let SE_user2 = document.createElement("span");
                SE_user1.setAttribute("class", "user");
                SE_user2.setAttribute("class", "user");
                SE_user1.setAttribute("id", users[i].id);
                SE_user2.setAttribute("id", users[i+1].id);
                SE_user1.appendChild(document.createTextNode(users[i].name));

                SE_user2.appendChild(document.createTextNode(users[i+1].name));

                SE_UserInList.appendChild(SE_user1);
                SE_UserInList.appendChild(document.createTextNode(" And "));
                SE_UserInList.appendChild(SE_user2);
                SE_Userlist.appendChild(SE_UserInList);
                i++;
                SE_user1.onmouseover = function (){

                    vm_menu.hoverOverUser(SE_user1.id);
                    document.getElementById('userInfoText').style.visibility = "visible";
                }
                SE_user1.onmouseleave = function (){
                    SE_userInfoText.innerHTML = "";
                    document.getElementById('userInfoText').style.visibility = "hidden";
                    document.getElementById("toHideOnViewNum").style.visibility = "visible";
                    document.getElementById("toHideOnViewText").style.visibility = "visible";
                    document.getElementById("toHideOnViewtimer").style.visibility = "visible";
                    document.getElementById("toHideOnViewButton").style.visibility = "visible";

                }
                SE_user2.onmouseover = function (){
                    vm_menu.hoverOverUser(SE_user2.id);
                    document.getElementById('userInfoText').style.visibility = "visible";
                }
                SE_user2.onmouseleave = function (){
                    SE_userInfoText.innerHTML = "";
                    document.getElementById('userInfoText').style.visibility = "hidden";
                    document.getElementById("toHideOnViewNum").style.visibility = "visible";
                    document.getElementById("toHideOnViewText").style.visibility = "visible";
                    document.getElementById("toHideOnViewtimer").style.visibility = "visible";
                    document.getElementById("toHideOnViewButton").style.visibility = "visible";
                }

            }
            SE_EditList.appendChild(SE_Userlist);

            let SE_sessionInfo = document.getElementById("wrapper");
            let SE_dateNum = document.createElement("p");
            SE_dateNum.appendChild(document.createTextNode('Date: ' + this.dateNum));
            let SE_textBox = document.createElement("p");
            SE_textBox.appendChild(document.createTextNode('Coming up'));
            let SE_timerButton = document.createElement("button");
            SE_timerButton.appendChild(document.createTextNode("Start timer"));

            SE_sessionInfo.appendChild(SE_timer);
            SE_timer.setAttribute("class", "timer");
            SE_timerButton.onclick = function() {
                vm_menu.startTimer();
            }
            /*SE_sessionInfo.appendChild(SE_timer);*/
            SE_sessionInfo.appendChild(SE_dateNum);
            SE_sessionInfo.appendChild(SE_textBox);
            SE_sessionInfo.appendChild(SE_timerButton);

            SE_dateNum.setAttribute("class", "timer");
            SE_textBox.setAttribute("class", "timer");
            SE_timerButton.setAttribute("class", "timerbutton");
            SE_dateNum.setAttribute("id", "toHideOnViewNum");
            SE_textBox.setAttribute("id", "toHideOnViewText");
            SE_timer.setAttribute("id", "toHideOnViewtimer");
            SE_timerButton.setAttribute("id", "toHideOnViewButton");


        },
        hoverOverUser: function(userID){
            console.log(userID);
            document.getElementById("toHideOnViewNum").style.visibility = "hidden";
            document.getElementById("toHideOnViewText").style.visibility = "hidden";
            document.getElementById("toHideOnViewtimer").style.visibility = "hidden";
            document.getElementById("toHideOnViewButton").style.visibility = "hidden";


            SE_userInfoText.setAttribute("class", "userInfo");
            SE_userInfoText.setAttribute("id", "userInfoText");



            let personalInfo = document.createElement("h3");
            personalInfo.appendChild(document.createTextNode("Personal Info:"))
            let question1 = document.createElement("p");
            question1.appendChild(document.createTextNode("Answer to question 1"));
            let question2 = document.createElement("p");
            question2.appendChild(document.createTextNode("Answer to question 2"));
            let question3 = document.createElement("p");
            question3.appendChild(document.createTextNode("Answer to question 3"));
            let ratingsReceived = document.createElement("h3");
            ratingsReceived.appendChild(document.createTextNode("Ratings received:"))
            let received1 = document.createElement("p");
            received1.appendChild(document.createTextNode("Answer to question 1 : "));
            let received2 = document.createElement("p");
            received2.appendChild(document.createTextNode("Answer to question 2 : "));
            let received3 = document.createElement("p");
            received3.appendChild(document.createTextNode("Answer to question 3 : "));
            let ratingsGiven = document.createElement("h3");
            ratingsGiven.appendChild(document.createTextNode("Ratings Given:"))
            let given1 = document.createElement("p");
            given1.appendChild(document.createTextNode("Answer to question 1"));
            let given2 = document.createElement("p");
            given2.appendChild(document.createTextNode("Answer to question 2"));
            let given3 = document.createElement("p");
            given3.appendChild(document.createTextNode("Answer to question 3"));
            SE_userInfoText.appendChild(document.createTextNode(userID));
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

            SE_userInfo.appendChild(SE_userInfoText);

        },


    }
})
const vm_users = new Vue({
    el: '#userList',
    data: {
        users: daters,
        userID: "",
    },
    methods:{
        removeUser: function(userID){ //This only removes the nametext of the user. Should remove entire user from the users array.
            console.log(userID);
            this.users.splice(userID-1, 1);

        },
        getUsers: function(){
            console.log(this.users);
            return this.users;
        }

    }
})

function blankArea(id) {
    let area = document.getElementById(id);
    area.innerHTML = "";
}