window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame   ||
	window.mozRequestAnimationFrame      ||
	window.oRequestAnimationFrame        ||
	window.msRequestAnimationFrame       ||
	function (callback) {
		window.setTimeout(callback, 1000 / 60);
	};
})();

var c = document.getElementById("canvas");
var ctx = c.getContext("2d");
c.width  = window.innerWidth;
c.height = window.innerHeight;
var center = new Vector2(c.width/2, c.height/2);

//Mouse Detection %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
var mouse = new Vector2(-1000, -1000);
c.addEventListener("mousemove", updateMouse);
function updateMouse(e) {
	mouse.x = e.pageX;
	mouse.y = e.pageY;
}
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%


//Vector2 class %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
function Vector2(x, y){
	this.x = x || 0.0;
	this.y = y || 0.0;
}

Vector2.prototype.lerp = function(v, t){
	this.x = lerp(this.x, v.x, t);
	this.y = lerp(this.y, v.y, t);
}

Vector2.prototype.distance = function(v){
	return Math.sqrt(Math.pow(v.x - this.x, 2) + Math.pow(v.y - this.y, 2));
}

Vector2.prototype.copy = function(v){
	this.x = v.x;
	this.y = v.y;
}

Vector2.prototype.getNewPositionFrom = function(v){
	this.x = v.x + (randomSign() * getRandom(minMovingValue, maxMovingValue));
	this.y = v.y + (randomSign() * getRandom(minMovingValue, maxMovingValue));
}
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%


// Main code
var start = new Vector2(center.x, center.y);

function drawCurve(){
	var increase = Math.PI * 2 / 100;
	var counter = 0;

	ctx.beginPath();
	ctx.lineWidth="5";
	ctx.moveTo(start.x, start.y - (Math.sin(counter) / 2 + 0.5) * 100);
	ctx.strokeStyle="red";

	for(var i=0; i < 3; i += 0.01){
		x = start.x + i * 100;
		y = start.y - (Math.sin(counter) / 2 + 0.5) * 100;
		// y = start.y - (i * i * i * i) * 100;
		ctx.lineTo(x, y);
		counter += increase;
	}
	ctx.stroke();
	ctx.closePath()

}

clrScreen();
drawPlanes(start);
drawCurve();
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
function drawPlanes(v){
	ctx.beginPath();
	ctx.lineWidth="2";
	ctx.strokeStyle="blue";
	
	ctx.moveTo(v.x, v.y);
	ctx.lineTo(v.x + c.width, v.y)
	ctx.lineTo(v.x - c.width, v.y)
	
	ctx.moveTo(v.x, v.y);
	ctx.lineTo(v.x, v.y - c.height)
	ctx.lineTo(v.x, v.y + c.height)
	
	ctx.stroke();
	ctx.closePath()
}



function clrScreen(){
	ctx.clearRect(0, 0, c.width, c.height);
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, c.width, c.height);
}

var update = function(){
	clrScreen();
	particlesController.update();
	requestAnimFrame(update);
}

// update();

// Auxiliary Functions
function getRandom(min, max){
	return(Math.random() * (max - min + 1) + min);
}

function getRandomInt(min, max){
	return(Math.floor(Math.random() * (max - min + 1)) + min);
}

function lerp(a, b, f){
	return(a + f * (b - a));
}

function randomSign(){
	return(Math.random() < 0.5 ? -1 : 1);
}

function ease(x){
	var a = 1;
	return(Math.pow(x, a) / (Math.pow(x, a) + Math.pow(1-x, a)));
}

function clamp(n, min, max){
	return(Math.max(a, Math.min(n, max)));
}