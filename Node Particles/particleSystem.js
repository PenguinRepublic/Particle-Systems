window.requestAnimFrame = (function() {
	return  window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame   ||
	window.mozRequestAnimationFrame      ||
	window.oRequestAnimationFrame        ||
	window.msRequestAnimationFrame       ||
	function(callback) {
		window.setTimeout(callback, 1000 / 60);
	};
})();

var c = document.getElementById("particleSystem");
var ctx = c.getContext("2d");
c.width  = window.innerWidth;
c.height = window.innerHeight;
var center = new Vector2(c.width/2, c.height/2);


var offset = 30;
var subDivisions = 25;

var numberOfConnections = 5;

var minMovingValue = 1.0;
var maxMovingValue = 30.0;

var mouse = new Vector2(-1000, -1000);
c.addEventListener("mousemove", updateMouse);
function updateMouse(e) {
	mouse.x = e.pageX;
	mouse.y = e.pageY;
}


/* Particle Class */
function Particle(p, v, id = 0) {
	this.id = id;
	this.position = new Vector2(p.x, p.y) || new Vector2();
	this.origin = new Vector2(p.x, p.y);
	this.newPosition = new Vector2();
	this.velocity = new Vector2(v.x, v.y) || new Vector2();
	this.size = getRandom(0, 0);
	this.closest = [];
	this.parents = [];
	this.color = "";
	this.alpha = "1";
	this.minSpeed = getRandom(0.3, 1.5);
	this.maxSpeed = getRandom(1.5, 2);
	this.active = true;
	this.lineWidth = 0;

	this.newPosition.getNewPositionFrom(this.origin);
	this.totalDistance = this.position.distance(this.newPosition);
	this.setColorWithAlpha();

	moveParticle(this);
}

Particle.prototype.setColorWithAlpha = function(){
	this.color = "rgba(0, 150, 0, " + this.alpha + ")";
};

Particle.prototype.draw = function(){
	if (!this.active)
		return;

	// ctx.beginPath();
	// ctx.arc(this.position.x, this.position.y, this.size, 0, 2*Math.PI);
	// ctx.closePath();
	// ctx.fillStyle = this.color;
	// ctx.fill();
	this.drawLineToClosest();
};

Particle.prototype.getMaxLineWidthAndColor = function() {
	var maxLineWidth = -1;
	var maxColor = "";
	for (var i in this.parents) {
		if (this.parents[i].lineWidth > maxLineWidth) {
			maxLineWidth = this.parents[i].lineWidth;
			maxColor = this.parents[i].color;
		}
	}
	for (var i in this.closest) {
		if (this.closest[i].lineWidth > maxLineWidth) {
			maxLineWidth = this.closest[i].lineWidth;
			maxColor = this.closest[i].color;;
		}
	}
	return {color: maxColor, lineWidth: maxLineWidth};
}

Particle.prototype.drawLineToClosest = function(){
	ctx.beginPath();
	lineWidthAndColor = this.getMaxLineWidthAndColor();
	ctx.lineWidth = this.lineWidth + 0.2;
	ctx.strokeStyle = lineWidthAndColor.color;
	for (var i = 0; i < numberOfConnections; i++) {
		ctx.beginPath();
		// ctx.strokeStyle = this.closest[i].color;
		ctx.moveTo(this.position.x, this.position.y);
		ctx.lineTo(this.closest[i].position.x, this.closest[i].position.y);
		ctx.stroke();
		ctx.closePath();
	}

};



Particle.prototype.update = function(){
	this.calculateColorAlpha();
	this.setColorWithAlpha();
};

Particle.prototype.calculateColorAlpha = function(){
	var d = this.position.distance(mouse);
	this.active = true;
	if (d <= 15) {
		this.lineWidth = 2;
		return this.alpha = "1";
	}
	if (d <= 25) {
		this.lineWidth = 1;
		return this.alpha = "0.8";
	}
	if (d <= 50) {
		this.lineWidth = 0.5;
		return this.alpha = "0.6";
	}

	if(d <= 70)
		return this.alpha = "0.4";
	if(d <= 120)
		return this.alpha = "0.3";

	this.active = false;
	this.lineWidth = 0;
	return this.alpha = "0";
};
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%


//ParticlesController Class %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
function ParticlesController(){
	this.particles = [];
	this.create();
}

ParticlesController.prototype.create = function(){
	/*
	 * Pushing particles with random position and 0.0 velocity
	 */
	var widthSpacing = c.width/subDivisions;
	var heightSpacing = c.height/subDivisions;
	var id = 0;
	for (var i = 0; i < c.width; i += widthSpacing) {
		for (var j = 0; j < c.height; j += heightSpacing) {
			var x = randomDistributing(i, widthSpacing);
			var y = randomDistributing(j, heightSpacing);
			this.particles.push(new Particle(new Vector2(x, y), new Vector2(), id++));
		}
	}

	for (var i = 0; i < this.particles.length; i++) {
		var p1 = this.particles[i];
		var closest = [];
		var act = 0;

		while (closest.length < numberOfConnections) {
			if (act++ != i) closest.push(this.particles[act]);
		}

		for (var j = 0; j < this.particles.length; j++) {
			if(i != j){
				var placed = false;
				var p2 = this.particles[j];
				for (k = 0; k < numberOfConnections; k++) {
					if (!placed && p1.position.distance(p2.position) < p1.position.distance(closest[k].position)) {
						closest[k] = p2;
						placed = true;
					}
				}
			}
		}

		p1.closest = closest;

		for (var e in closest) {
			var innerParticle = closest[e];
			innerParticle.parents.push(p1);
		}
	}
	// console.log("Created " + this.particles.length + " Particles!");
};

ParticlesController.prototype.update = function() {
	for (var i = 0; i < this.particles.length; i++) {
		this.particles[i].update();
		this.particles[i].draw();
	}
};
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%


var clrScreen = function() {
	ctx.clearRect(0, 0, c.width, c.height);
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, c.width, c.height);
}

//Main code
var particlesController = new ParticlesController();

var update = function() {
	clrScreen();
	particlesController.update();
	requestAnimFrame(update);
}

update();

function randomlyDistributed(width, height, distance) {
	var x = getRandom(0, width);
	var y = getRandom(0, height);
	var d = 1 / Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));

	x *= d * distance;
	y *= d * distance;

	console.log( "New Vector 2 : (" + x + ", " + y + ")" );
	return new Vector2(x, y);
}

function moveParticle(p) {
	TweenLite.to(
		p.position,
		getRandom(p.minSpeed, p.maxSpeed),
		{
			x: getRandom(p.origin.x - offset, p.origin.x + offset),
			y: getRandom(p.origin.y - offset, p.origin.y + offset),
			ease: Expo.easeInOut,
			onComplete: function() {
				moveParticle(p);
			}
		}
	);
}
