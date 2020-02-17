





const vm = new Vue({
    el: '#loginSection',
    data: {
        user: "",
	pass: ""
     
    },

    methods: {
	login: function(){loginClicked();},
	createAccount: function(){createAccountClicked();},
	
        markDone: function() {

	}
    }

});

loginClicked = function(){
    console.log("click");
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
    
    div.appendChild(eventCodeText);
    div.appendChild(eventCode);
    div.appendChild(frwBtn);

};

createAccountClicked = function(){
    let accountInfo = [
	"Username",
	"E-mail",
	"Email",
	"pettaP"
    ];
    let linebreak = document.createElement("br");
    
    let div = document.getElementById("loginInfoDiv");
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

    for(x in ages){
	let temp = document.createElement("option");
	temp.setAttribute("id", "ageOption");
	temp.innerHTML = ages[x];
	ageDropdown.appendChild(temp);
    }
    
    genderAgeDiv.appendChild(genderDiv);
    genderAgeDiv.appendChild(ageDropdown);
    div.appendChild(genderAgeDiv);

    // TEXT INPUT USERNAME, PASSWORD ETC
    for(inf in accountInfo){
	let temp = document.createElement("input");
	temp.setAttribute("class", "userLogin");
	temp.setAttribute("placeholder", accountInfo[inf]);
	div.appendChild(temp);
    }
    
    
    
    
    
}
