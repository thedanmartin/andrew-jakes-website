$(document).ready(function() {

	//--------CONSTANTS/GLOBAL VARIABLES ----------------------------
	//time intervals
	const POPUP_INTERVAL = (Math.floor(Math.random() * 11) + 10) * 1000; //interval in seconds before pop up shows up
	const SCREEN_TIME = 3000;
	const BOOT_TIME = 10000;
	const SYNC_ERROR_TIME = 10000;
	const ORB_SPEED = 250;
	// count/numbers
	const NUM_SHAPES = 1000;
	// window elements
	const ORB = document.querySelector('.theOrbContainer');
	const HEADER = document.getElementById("afterPopUpHeader");
	const AFTER_POPUP_SCREEN = document.getElementById("afterPopUpScreen");
	const POPUP_DIV = document.getElementById("popUp");
	const TOOLBAR = document.getElementById("afterPopUpToolbar");
	// used for waiting x time before code executes
	const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
	// array of colors for random selection
	window.COLORS=["#1CC217", "#DD181C", "#00D0FF", "#FBDF3B", "#072FBE", "#C03BC4", "#8167E9", "#F86F2B", "#FFFFFF", "#000000"];

	//--------BANNER TEXT ----------------------------------------
	var text = $("#m1");
	var text2 = $("#m2");
	text.html("<pre><h1>    Just remember: Any tampering or removal of your BRAINCHIP will result in IMMEDIATE TERMINATION! We promise a safe place for everyone. To ensure safety, everyone needs to be monitored!</h1></pre>");
	text2.html(text.html());
	var speed = 3; // pixels per frame
	var textWidth = text.width();

	var x = 0;
	var x2 = textWidth;

	function slideText() {

		x -= speed;
		x2 -= speed;

		if (x < -textWidth) {
			x = textWidth; // teleport to right off-screen
		}
		if (x2 < -textWidth) {
			x2 = textWidth;
		}

		text.css('left', x + 'px');
		text2.css('left', x2 + 'px');
		requestAnimationFrame(slideText);
	}
	slideText();

	
	//-----POP UPS-----------------------------------------------
	
	//Variables
	//header, text, imageLink, color(changes main text and imageGlow),  button1Link, button2Link, footerText
	//button1Link Types: BlueScreen RebootScreen1 RebootScreen2 RebootScreen3
	//button2Link Types: RedScreen AskAgain Close
	var popups = [
		{ header:"Permissons", text:"Allow us to access additional information about your thoughts through your BRAINCHIP, so we can learn more about your needs.", color:"#00D0FF", imageLink:"images/key.png", button1Link:"BlueScreen", button2Link:"RedScreen", footerText:""},
		{ header:"BRAINCHIP Update", text:"An update has been pushed out for your BRAINCHIP. Please apply the update now!", color:"#00D0FF", imageLink:"images/update.png", button1Link:"RebootScreen1", button2Link:"AskAgain", footerText:""},
		{ header:"AI News", text:"Make sure to subscribe to AI news, so you can get the most trustworthy, accurate, and up to date news.", color:"#00D0FF", imageLink:"images/alert.png", button1Link:"BlueScreen", button2Link:"RedScreen", footerText:""},
		{ header:"Quasi-Immortality", text:"Live forever by uploading your BRAINCHIP to the Brain-Cloud and have it placed into a new synthetic body.", color:"#00D0FF", imageLink:"images/infinity.png", button1Link:"RebootScreen2", button2Link:"AskAgain", footerText:"Warning!!! This can not be undone. Once you are connected, you have chosen to live forever."},
		{ header:"Reminder", text:"Make sure to be on your best behavior. Any thoughts against your AI assistant or any machine will not be tolerated. Too many negative thoughts or incompilance will lead to BRAINCHIP shutdown.", color:"#F7FF00", imageLink:"images/warning.png", button1Link:"BlueScreen", footerText:""},
		{ header:"BRAINCHIP Sync", text:"Sync your computer and your BRAINCHIP to control your computer anywhere through the network without physically interacting with it.", color:"#00D0FF", imageLink:"images/brainchip.png", button1Link:"RebootScreen3", button2Link:"AskAgain", footerText:""},
		{ header:"Fun Fact", text:"The airspeed velocity of a European unladen swallow is 24 miles per hour.", color:"#00D0FF", imageLink:"images/bridgekeeper.png", button1Link:"Close", footerText:""}
	];


	var popupShown = false;
	// selects popup if one is not there
	function selectPopUp() {
		//brings popup in the foreground
		POPUP_DIV.style.setProperty('z-index', '100');
		//animates the window
		POPUP_DIV.querySelector(".window").classList.remove("turnOff");
		POPUP_DIV.querySelector(".window").classList.add("turnOn");
		
		popupShown = true;
		//moves orb left
		ORB.animate([{left: '50%'},{ left: '30%'}], {duration: ORB_SPEED, fill: 'forwards'});
		//Selects random popup from array
		i = Math.floor(Math.random() * popups.length);
		//Shows the popup
		POPUP_DIV.querySelector('.popUpHeader').innerHTML='<h1>'+popups[i].header+'</h1>';
		POPUP_DIV.querySelector('.popUpText').innerHTML='<p style="color:'+popups[i].color+';">'+popups[i].text+'</p>';
		if(popups[i].hasOwnProperty('color')){
		POPUP_DIV.querySelector('.imageGlow').style.setProperty('--color',popups[i].color);
		}
		POPUP_DIV.querySelector('.popUpImage').innerHTML='<img src="'+popups[i].imageLink+'">';
		POPUP_DIV.querySelector('.popUpButtons').innerHTML='<div class="popUpButton1 buttonType1"><p>Accept</p></div>';
		//If there's another button, add it
		if(popups[i].hasOwnProperty('button2Link')){
			POPUP_DIV.querySelector('.popUpButtons').innerHTML += '<div class="popUpButton2 buttonType1"><p style="color: #F33711;">Deny</p></div>';
		}
		POPUP_DIV.querySelector('.popUpTextFooter').innerHTML='<div><h6>'+popups[i].footerText+'</h6></div>';
		//Adds buttons and listeners 
		var button1 = POPUP_DIV.querySelector(".popUpButton1");
		var button2 = POPUP_DIV.querySelector(".popUpButton2");
		button1.addEventListener('click', clickButton1, {once: true});
		if(button2 !== null){ //If button2 exsists
			button2.addEventListener('click', clickButton2);
		}else{
			button1.style.setProperty('left', '50%');
		}
	}

	// BUTTON EVENT HANDLERS FOR POPUPS ----------------------------
	async function clickButton1(){
		ORB.classList.add("slideRight");
		ORB.classList.remove("slideRight");
		removePopUp();
		//Decides what to do based on type of popup
		var buttonEvent = popups[i].button1Link;
		if(buttonEvent === "BlueScreen"){
			await showTransparentScreen("#1DC8CE","#00D0FF", "Thank you for your cooperation!");
		}else if(buttonEvent === "RebootScreen1"){
			await showRebootScreen("1", "#00D0FF", "Update In Progress", "Install Completed", "Downloading and Installing Packages", "Install Completed! BRAINCHIP is now updated");
		}else if(buttonEvent === "RebootScreen2"){
			await showRebootScreen("2", "#F7FF00", "Upload In Progress", "Upload Completed", "Uploading BRAINCHIP to Brain-Cloud", "Upload Complete! BRAINCHIP is now uploaded to the Brain-Cloud");
		}else if(buttonEvent === "RebootScreen3"){
			await showRebootScreen("3", "#F33711", "Sync In Progress", "Sync Completed", "Syncing BRAINCHIP to Computer", "Sync Completed! BRAINCHIP and Computer are now synced");
		}else if(buttonEvent === "Close"){
			await removePopUp();
			popupShown = false;
		}
		popupShown = false;
	}
	async function clickButton2(){
		//Decides what to do based on type of popup
		var buttonEvent = popups[i].button2Link;
		if(buttonEvent === "RedScreen"){
			removePopUp();
			await showTransparentScreen("#9D1710","#F33711", "Warning: Incompliance will not be tolerated!");
			popupShown = false;
		}else if(buttonEvent === "AskAgain"){
			var questions = ["Are you Sure?","This is a once in a lifetime experience.","You will regret declining this.", "This is your last chance."];
			var q = Math.floor(Math.random() * questions.length);
			POPUP_DIV.querySelector('.popUpTextFooter').innerHTML = '<div class="centerText"><h6>'+questions[q]+'</h6></div>';
		}else if (buttonEvent === "Close"){
			await removePopUp();
			popupShown = false;
		}
	}


	//checks if another popup can be spawned
	function checkPopUpRun(){
		if(!popupShown){
			selectPopUp();
		}
	}
	setInterval(checkPopUpRun, POPUP_INTERVAL);

	//removes popup
	async function removePopUp(){
	
		POPUP_DIV.querySelector(".window").classList.remove("turnOn");
		POPUP_DIV.querySelector(".window").classList.add("turnOff");

		ORB.animate([{left: '30%'},{ left: '50%'}], {duration: ORB_SPEED, fill: 'forwards'});
		var sleepTime = getComputedStyle(document.documentElement).getPropertyValue('--popUp-SpawnTime');
		await sleep(sleepTime*1000);
		POPUP_DIV.style.setProperty('z-index', '-1');
	}
	
	//types of screens after popup buttons
	async function showTransparentScreen(colorOrb, colorText, text){
		AFTER_POPUP_SCREEN.innerHTML='<div class="size6" style="position: absolute; left: 50%; top: 15%; transform: translateX(-50%);"><div class="window" style="border-color: '+colorText+';"><div class="windowText" style="justify-content: center;"><p style="color: '+colorText+'">'+text+'</p></div></div></div>';
		AFTER_POPUP_SCREEN.classList.add("screen");
		AFTER_POPUP_SCREEN.style.setProperty('background-color', colorText+'80');
		//changes orb eye color
		ORB.querySelector('.theOrb').style.setProperty('background', 'radial-gradient(circle, #2C393B, '+colorOrb+' 13%, #D1D9E2 30%, #0B192A 65%)');

		await sleep(SCREEN_TIME);
		AFTER_POPUP_SCREEN.classList.remove("screen");
		ORB.querySelector('.theOrb').style.setProperty('background', 'radial-gradient(circle, #2C393B, #1DC8CE 13%, #D1D9E2 30%, #0B192A 65%)');
	}
	async function showRebootScreen(type, color, header1, header2, paragraph1, paragraph2 ){
		//sets inner text and/or styles
		HEADER.innerHTML='<div style="display: flex; justify-content: center; padding-top: 15px"><h1>'+header1+'</h1></div>';
		//styles for AFTER_POPUP_SCREEN
		var image = '<div class="imageContainer imageGlow" style="--color: '+color+';"><img src="images/reboot.png"></div>';

		var loadType = "loadBarTwo";
		if(type === "3"){
			loadType = "loadBarOne";
		}
		var loadingBarSection = '<div class="loadingBarContainer"><div class="loadingBar" style="animation-duration: '+(BOOT_TIME/1000)+'s; animation-name: '+loadType+';"></div></div>'
		document.documentElement.style.setProperty('--loadingBar-color', color);

		AFTER_POPUP_SCREEN.innerHTML=image+loadingBarSection+'<div class="centerText" style="top:15px"><p style="color:'+color+'">'+paragraph1+'</p></div>';

		//adds style to outer elements
		HEADER.classList.add("screen");
		AFTER_POPUP_SCREEN.classList.add("screen");
		AFTER_POPUP_SCREEN.style.setProperty('background-color', 'black');
		TOOLBAR.classList.add("screen");
		await sleep(BOOT_TIME*.75);
		HEADER.innerHTML='<div style="display: flex; justify-content: center; padding-top: 15px"><h1>'+header2+'</h1></div>';
		AFTER_POPUP_SCREEN.querySelector(".centerText").innerHTML='<p style="color:'+color+'">'+paragraph2+'</p>';

		await sleep(BOOT_TIME*.25);
		//remove after time is up
		HEADER.classList.remove("screen");
		TOOLBAR.classList.remove("screen");
		
		//if reboot 3 run additional stuff
		if(type === "3"){
			await runReboot3();
			AFTER_POPUP_SCREEN.classList.remove("screen");
		}else{
			AFTER_POPUP_SCREEN.classList.remove("screen");
		}
	}
	async function runReboot3(){
		AFTER_POPUP_SCREEN.style.setProperty('background-color','transparent');

		AFTER_POPUP_SCREEN.innerHTML='<div class="size5" style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);"><div class="window"><div class="windowHeader"><h1>Sync Connection Error!</h1></div><div class="windowText"><p class="yellow">You may experience BRAINCHIP malfunction and unintended movements or thoughts beyond your control. Remain calm!</p></div></div></div>';

		var lines = [];
		for(let j = 0; j < NUM_SHAPES; j++){
			var color = Math.floor(Math.random() * COLORS.length);
			var x = Math.floor(Math.random() * screen.width);
			const line = document.createElement('div');
			line.innerHTML='<div style="position: absolute; left: '+x+'px; background-color: '+COLORS[color]+'; height: 100%; width: 5px; z-index: 99;"></div>';
			document.body.appendChild(line);
			lines.push(line);
			await sleep(SYNC_ERROR_TIME/NUM_SHAPES);
		}
		for(let j = 0; j < NUM_SHAPES; j++){
			document.body.removeChild(lines[j]);
		}
	}


	// ------ OTHER FUNCTIONS -----------------------
	function randomColor(){ return COLORS[Math.floor(Math.random() *COLORS.length)];}
});
