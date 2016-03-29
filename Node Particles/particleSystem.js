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

var c = document.getElementById("particleSystem");
var ctx = c.getContext("2d");
c.width  = window.innerWidth;
c.height = window.innerHeight;
var center = new Vector2(c.width/2, c.height/2);

var numberOfParcticles = 800;
var numberOfConnections = 5;

var minMovingValue = 1.0;
var maxMovingValue = 30.0;

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


//Particle Class %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
function Particle(p, v){
	this.position = new Vector2(p.x, p.y) || new Vector2();
	this.origin = new Vector2(p.x, p.y);
	this.newPosition = new Vector2();
	this.velocity = new Vector2(v.x, v.y) || new Vector2();
	this.size = getRandom(3, 8);
	this.closest = [];
	this.color = "";
	this.alpha = "1";
	this.speedMod = getRandom(0.6, 1.5);
	
	this.newPosition.getNewPositionFrom(this.origin);
	this.totalDistance = this.position.distance(this.newPosition);
	this.setColorWithAlpha();
}

Particle.prototype.init = function(){
	//Do stuff
};

Particle.prototype.setColorWithAlpha = function(){
	this.color = "rgba(255, 0, 0, " + this.alpha + ")";
};

Particle.prototype.draw = function(){
	ctx.beginPath();
	ctx.arc(this.position.x, this.position.y, this.size, 0, 2*Math.PI);
	ctx.closePath();
	ctx.fillStyle = this.color;
	ctx.fill();
	this.drawLineToClosest();
};

Particle.prototype.drawLineToClosest = function(){
	ctx.beginPath();
	for(var i = 0; i < numberOfConnections; i++){
		ctx.strokeStyle = this.closest[i].color;
		ctx.moveTo(this.position.x, this.position.y);
		ctx.lineTo(this.closest[i].position.x, this.closest[i].position.y);
		ctx.stroke();
	}	
	ctx.closePath();
};

Particle.prototype.move = function(){
	var d = this.position.distance(this.newPosition);
	if(d < 0.1){
		this.newPosition.getNewPositionFrom(this.origin);
		this.totalDistance = this.position.distance(this.newPosition);
	}else if(d < this.totalDistance / 4){
		this.position.lerp(this.newPosition, 0.05 * this.speedMod);
	}else if(d < this.totalDistance / 2){
		this.position.lerp(this.newPosition, 0.1 * this.speedMod);
	}else{
		this.position.lerp(this.newPosition, 0.05 * this.speedMod);
	}
};

Particle.prototype.update = function(){
	this.calculateColorAlpha();
	this.setColorWithAlpha();
	this.move();
};

Particle.prototype.calculateColorAlpha = function(){
	var d = this.position.distance(mouse);
	if(d <= 10)
		return this.alpha = "1";
	if(d <= 30)
		return this.alpha = "0.8";
	if(d <= 70)
		return this.alpha = "0.6";
	if(d <= 100)
		return this.alpha = "0.4";
	if(d <= 120)
		return this.alpha = "0.3";
	return this.alpha = "0";
};
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%


//ParticlesController Class %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
function ParticlesController(){
	this.particles = [];
	this.create();
}

ParticlesController.prototype.create = function(){
	for(var i = 0; i < numberOfParcticles; i++){
		this.particles.push(new Particle(new Vector2(getRandom(0, c.width), getRandom(0, c.height)), new Vector2()));
	}
	for(var i = 0; i < numberOfParcticles; i++){
		var p1 = this.particles[i];
		var closest = [];
		var act = 0;

		while(closest.length < numberOfConnections){
			if(act++ != i) closest.push(this.particles[act]);
		}

		for(var j = 0; j < numberOfParcticles; j++){
			if(i != j){
				var placed = false;
				var p2 = this.particles[j];
				for(k = 0; k < numberOfConnections; k++){
					if(!placed && p1.position.distance(p2.position) < p1.position.distance(closest[k].position)){
						closest[k] = p2;
						placed = true;
					}
				}
			}
		}
		p1.closest = closest;
	}
};

ParticlesController.prototype.update = function(){
	for(var i = 0; i < numberOfParcticles; i++){
		this.particles[i].update();
		this.particles[i].draw();
	}
};
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%


var clrScreen = function(){
	ctx.clearRect(0, 0, c.width, c.height);
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, c.width, c.height);
}

//Main code
var particlesController = new ParticlesController();

var update = function(){
	clrScreen();
	particlesController.update();
	requestAnimFrame(update);
}

update();

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
