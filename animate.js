
window.requestAnimFrame = (function(callback) {
	return window.requestAnimationFrame || 
	window.webkitRequestAnimationFrame || 
	window.mozRequestAnimationFrame || 
	window.oRequestAnimationFrame || 
	window.msRequestAnimationFrame ||
	function(callback) {
		window.setTimeout(callback, 1000 / 60);
	};
})();


function drawRectangle (myRectangle, posx, posy, c) {
	c.beginPath();
	c.rect(posx, posy, myRectangle.width, myRectangle.height);
	c.fillStyle = myRectangle.color;
	c.fill();
	c.lineWidth = myRectangle.borderWidth;
	c.strokeStyle = myRectangle.color;
	c.stroke();
}

// Ecriture des coordonnees + sections
function writeMessage(context, message, posX, posY, clear) {
  	if(clear){context.clearRect(0, 0, canvas.width, canvas.height);}

	context.font = '6pt Open Sans';
	context.fillStyle = '#fff';
	context.fillText(message, posX, posY);
}

function randomInterval(min, max){
	return Math.floor(Math.random()* (max-min+1)+min);
}

function Rectangle (width, height, color, borderWidth, strokeColor, posTable) {

	this.height = height;
	this.width = width;
	this.color = color;
	this.borderWidth = borderWidth;
	this.strokeColor = strokeColor;
	this.posTable = posTable;
}

// Read the text to put it in a table
function readTextFile(file, dest){
	var weathertable = [];
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                weathertable = allText.split("\n");
                
            }
        }
    }
    rawFile.send(null);
 	weathertable.forEach(function(currentValue){
 		w = currentValue.split(" ");
 		dest.push(parseFloat(w[1]));
 	})
}

function animate (myRectangle, posx, posy, cnv, ctx, startTime, t, tt) {
	var time = (new Date()).getTime() - startTime;
	var linearSpeed = 20;
	var temp, nextTemp;
	var newX = (linearSpeed * time / 1000) + initX;
	if(t){
		temp = t;
		nextTemp = tt;
	}


	// Timer so it calculate the point every 1/180sec
	timer++;
	if(timer%180 == 0 || time <= 1){
		temp = init + myRectangle.posTable[i++]*-20;
		nextTemp = init + myRectangle.posTable[i]*-20;
		currentX += 60;
	}
	var a = currentX, b = temp, c = currentX+60, d = nextTemp;
	

	// Calculate the point in the hypothenuse between the current and the next coordinate.
	var variation = (((d-b)/(c-a))*newX) + ((b*c)-(a*d))/(c-a);
	var newY = variation + (randomInterval(0,3)?
		randomInterval(randomInterval(-150,0), randomInterval(0, 150)):randomInterval(randomInterval(-500,0), randomInterval(0, 500)));
	var realTemp = ((newY/-20)+15);
	var coordonnees = 't:' + realTemp;

	var test = realTemp*100;
	var day = Math.floor(i/8);
	var hour = (i-1)*3;

	if((newY > 450 || newY < 250) && isFinite(newY)) {synth.triggerAttack((test.toString()));}
	if(isFinite(variation)){synth2.triggerAttack((-1*variation)+randomInterval(-110,110));}

	//synth2.triggerAttack(test+randomInterval(-20,20));
	
	if (newX < cnv.width*2 - myRectangle.width - myRectangle.borderWidth / 2) {posx = newX;}
	if (newY < cnv.height*2 - myRectangle.height - myRectangle.borderWidth / 2) {posy = newY;}

	drawRectangle(myRectangle, posx, posy, ctx);



	var clr = myRectangle.color = numberToColor(Math.floor(Math.abs(realTemp)*10000), (realTemp>0?'c':'0'));


	writeMessage(context3, coordonnees, posxTxt, posyTxt, true);
	writeMessage(context3, 'x:' + newX, posxTxt, posyTxt+10, false);
	writeMessage(context3, 'y:' + newY, posxTxt, posyTxt+20, false);
	writeMessage(context3, 'a:' + a, posxTxt, posyTxt+30, false);
	writeMessage(context3, 'b:' + b, posxTxt, posyTxt+40, false);
	writeMessage(context3, 'c:' + c, posxTxt, posyTxt+50, false);
	writeMessage(context3, 'd' + d, posxTxt, posyTxt+60, false);
	writeMessage(context3, 'posx:' + posx, posxTxt, posyTxt+70, false);
	writeMessage(context3, 'posy:' + posy, posxTxt, posyTxt+80, false);
	writeMessage(context3, 'day:' + day, posxTxt, posyTxt+90, false);
	writeMessage(context3, 'hour: ' + hour, posxTxt, posyTxt+100, false);
	writeMessage(context3, 'clr:' + clr, posxTxt, posyTxt+110, false);
	writeMessage(context3, 'date:' + mois+'_'+(jour+1), posxTxt, posyTxt+120, false);




	if(i >= myRectangle.posTable.length){return;}
	if(posx>=cnv.width){
		//aud.pause();
		continuer = true;
		return true;}

	{
		requestAnimFrame(function () {
			animate(myRectangle, posx, posy, cnv, ctx, startTime, temp, nextTemp);
		});
	}
}


function numberToColor(number, z){
    return "#"+pad(number.toString(16),6,z)
}

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function fileExists(file){
	var http = new XMLHttpRequest();
	http.open('HEAD', file, false);
	http.send();
}

// Start the animation
function start(rect, posx, posy, cnv, ctx) {
	var fichierTxt = (mois+'_'+jour+'.txt');


	//if(!fileExists(fichierTxt)){
	//	mois = initMois;
	//	jour = initJour;

	//}
	fichierTxt = (mois+'_'+jour+'.txt');

	// Text read and parse
	rect.posTable = [];
	readTextFile(fichierTxt, rect.posTable);

	var startTime = (new Date()).getTime();
	animate(rect, posx, posy, cnv, ctx, startTime);
	jour--;
}

// Canvas declaration
	var canvas = document.getElementById('cnv1');
	var canvas2 = document.getElementById('cnv2');

	var context1 = canvas.getContext('2d');
	var context3 = canvas2.getContext('2d');

	var mainDiv = document.querySelector(".main");

// Variables declaration
	var timer = 0;
	var w = [];
	var temperature = [];
	var init = 300;
	var posxTxt = 20;
	var posyTxt = 180;
	var continuer = false;

// Graphics variations

	var i = 0;
	var initX = 150;
	var currentX = initX-60;
	var aud;

// Get the date
	var initMois = mois = (new Date()).getMonth() + 1;
	var initJour = jour = (new Date()).getDate();


// Objects declaration
	var dotTemperature = new Rectangle(1, 1, "red", 1, "000", temperature);
	

// Generate the modulation object

	var vol1 = new Tone.Volume(-10);
	var vol2 = new Tone.Volume(-15);
	var synth = new Tone.Synth({
		"oscillator" : {
			"type" : "sine",
			"modulationFrequency" : 0.5
		},
		"envelope" : {
			"attack" : 0.0,
			"decay" : 0.,
			"sustain" : 0.,
			"release" : 0
		}
	}).chain(vol2, Tone.Master);
	var synth2 = new Tone.Synth({
		"oscillator" : {
			"type" : "sine",
			"modulationFrequency" : 10
		},
		"envelope" : {
			"attack" : 0.1,
			"decay" : 0.2,
			"sustain" : 0.3,
			"release" : 0.1
		}
	}).chain(vol1, Tone.Master);


// Start the animation

setTimeout(function(){

	continuer = start(dotTemperature, 0, init, canvas, context1);
	
	}, 1000);
	setInterval(function(){
		if(continuer){
			continuer = false;
			timer = i = 0;
			currentX = initX - 60;
			continuer =  start(dotTemperature, 0, init, canvas, context1);}
	},100)
	



