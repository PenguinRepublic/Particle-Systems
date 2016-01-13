var c = document.getElementById("particleSystem");
var ctx = c.getContext("2d");
c.width  = window.innerWidth;
c.height = window.innerHeight;

//Config Variables


// Animation function
window.requestAnimFrame = function(callback){
		window.setTimeout(callback, 1000 / 60);
	};

// Auxiliary Functions
function getRandom(min, max){
	return Math.random() * (max - min + 1) + min;
}

function getRandomInt(min, max){
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function lerp(a, b, f){
	return(a + f * (b - a));
}

function randomSign(){
	return(Math.random() < 0.5 ? -1 : 1);
}

// Data Structures
function Vector2(xx, yy){
	this.x = xx || 0.0;
	this.y = yy || 0.0;
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

Vector2.prototype.randomMoveFrom = function(v){
	this.x = v.x + (getRandom(2, 5) * randomSign());
	this.y = v.y + (getRandom(2, 10) * randomSign());
}

function Particle(pos, color){
	//Attributes
	this.speed = 100;
	this.focusPoint = pos || new Vector2(300, 300);
	this.position = pos || new Vector2(300, 300);
	this.targetPosition = new Vector2(0, 0);
	this.velocity = new Vector2(30, 30);
	this.resistance = new Vector2();
	this.color = color || "#" + getRandomInt(5, 16777216).toString(16);
	this.radius = 30;
	this.size = this.radius;
	this.angleDest = 0;
}

Particle.prototype.move = function(){
	this.repulse();
	this.position.x += this.velocity.x + this.resistance.x;
	this.position.y += this.velocity.y + this.resistance.y;
	
};

Particle.prototype.repulse = function(){
	var value = 200;
	var dx = mouse.x - this.position.x;
	var dy = mouse.y - this.position.y;
	var distance = Math.sqrt((dx * dx) + (dy * dy));
	if(distance < value){
		var alpha = Math.atan2(dy, dx);
		this.velocity.x = Math.cos(alpha) * (value - distance) * -1;
		this.velocity.y = Math.sin(alpha) * (value - distance) * -1;
		this.angleDest = alpha;
	}else{
		dx = this.focusPoint.x - this.position.x;
		dy = this.focusPoint.y - this.position.y;
		this.angleDest = Math.atan2(dy, dx);
		this.velocity.x = lerp(this.velocity.x, Math.cos(this.angleDest) * this.speed, 0.04);
		this.velocity.y = lerp(this.velocity.y, Math.sin(this.angleDest) * this.speed, 0.04);
	}
	this.size = lerp(this.radius, this.position.distance(this.focusPoint)*0.2, 0.5);
}

Particle.prototype.update = function(){
	this.move();
	this.drawTest();
	this.draw();
}

Particle.prototype.drawTest = function(){
	ctx.fillStyle = "blue";
	ctx.textAlign = "center";
	ctx.font = "30px Impact";
	ctx.fillText(("target: (" + this.targetPosition.x+ "," + this.targetPosition.y + ")"), 300, 60);
	ctx.fillText(("Mouse:(" + mouse.x + "," + mouse.y + ")"), 300, 200);
}

Particle.prototype.draw = function(){
	ctx.beginPath();
	ctx.arc(this.position.x, this.position.y, this.size, 0, 2*Math.PI);
	ctx.closePath();
	ctx.fillStyle = this.color;
	ctx.fill();
}

//Global Variables
var mouse = new Vector2(-1000, -1000);
var p = new Particle();

//Main functions
function update(){
	ctx.fillStyle = 'black';
	ctx.fillRect(0, 0, c.width, c.height);
	p.update();
}

var oldTime = new Date();
var fps = 0;

function animLoop(){
	requestAnimFrame(animLoop);
	update();
	showFps();
}

function showFps(){
	ctx.fillStyle = "red";
	ctx.textAlign = "center";
	ctx.font = "30px Impact";
	ctx.fillText("fps:" + Math.floor(fps), c.width-200, c.height/10);
	newTime = new Date();
	fps = 1000 / (newTime - oldTime);
	oldTime = newTime;
}

//Mouse
c.addEventListener("mousemove", updateMouse);
function updateMouse(e){
	mouse.x = e.pageX;
	mouse.y = e.pageY;
}

animLoop();
