"use strict";

// Animation function
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


//Config Variables
var canvas = document.getElementById("particleSystem");
var ctx = canvas.getContext("2d");
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;


//Particle Class
function Particle(pos, vel, acc){
	this.position = pos || new Vector2();
	this.velocity = vel || new Vector2();
	this.acceleration = acc || new Vector2();
}

Particle.prototype.move = function(){
	this.velocity.add(this.acceleration);
	this.position.add(this.velocity);
}

Particle.prototype.draw = function(){
	ctx.beginPath();
	ctx.arc(this.position.x, this.position.y, this.size, 0, 2*Math.PI);
	ctx.closePath();
	ctx.fillStyle = this.color;
	ctx.fill();
}

Particle.prototype.submitToFields = function(fields){
	var totalAccelerationX = 0;
	var totalAccelerationY = 0;

	for(var i = 0; i < fields.length; i++){
		var field = fields[i];
		var vectorX = field.position.x - this.position.x;
		var vectorY = field.position.y - this.position.y;
		var force = field.mass / Math.pow(vectorX * vectorX + vectorY * vectorY, 1.5);
		totalAccelerationX += vectorX * force;
		totalAccelerationY += vectorY * force;
	}

	this.acceleration = new Vector2(totalAccelerationX, totalAccelerationY);
}


//Emitter Class
function Emitter(pos, vel, spread){
	this.position = pos;
	this.velocity = vel;
	this.spread = spread || Math.PI / 32;
	this.drawColor = "#999";
}

Emitter.prototype.emitParticle = function(){
	var angle = this.velocity.getAngle() + this.spread - (Math.random() * this.spread * 2);
	var magnitude = this.velocity.getMagnitude();
	var position = new Vector2(this.position.x, this.position.y);
	var velocity = Vector2.fromAngle(angle, magnitude);
	return new Particle(position, velocity);
}


//Field class
function Field(pos, mass){
	this.position = pos;
	this.setMass(mass);
}

Field.prototype.setMass = function(mass){
	this.mass = mass || 100;
	this.drawColor = mass < 0 ? "#f00" : "#0f0";
}


//Global Variables
var mid = new Vector2(canvas.width / 2, canvas.height / 2);
var mouse = new Vector2(mid.x, mid.y);
var maxParticles = 20000;
var emissionRate = 30;
var particleSize = 1;
var circleSize = 3;
var menu = new Menu();

var particles = []
// var emitters = [new Emitter(new Vector2(mid.x - 100, mid.y), Vector2.fromAngle(0, 2))];
// var fields = [new Field(new Vector2(mid.x + 100, mid.y), -140)];

var emitters = [
  new Emitter(new Vector2(mid.x + 50, mid.y), Vector2.fromAngle(6, 2))
];
 
var fields = [
  new Field(new Vector2(mid.x + 100, mid.y + 20), 140),
  new Field(new Vector2(mid.x - 100, mid.y + 20), 100),
  new Field(new Vector2(mid.x, mid.y + 20), -20),
];


//Main functions
function update(){
	addNewParticles();
	plotParticles(canvas.width, canvas.heigth);
}

function addNewParticles(){
	if(particles.length > maxParticles)
		return;
	
	for(var i = 0; i < emitters.length; i++){
		for(var j = 0; j < emissionRate; j++){
			particles.push(emitters[i].emitParticle());
		}
	}
}

function plotParticles(boundX, boundY){
	var currentParticles = [];

	for(var i = 0; i < particles.length; i++){
		var particle = particles[i];
		var pos = particle.position;

		if(pos.x < 0 || pos.x > boundX || pos.y < 0 || pos.y > boundY)
			continue;

		particle.submitToFields(fields);
		particle.move();
		currentParticles.push(particle);
	}

	particles = currentParticles;
}

function clearScreen(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawParticles(){
	ctx.fillStyle = 'rgb(0, 0, 255)';
	for(var i = 0; i < particles.length; i++){
		var pos = particles[i].position;
		ctx.fillRect(pos.x, pos.y, particleSize, particleSize);
	}
}

function drawCircle(obj){
	ctx.fillStyle = obj.drawColor;
	ctx.beginPath();
	ctx.arc(obj.position.x, obj.position.y, circleSize, 0, Math.PI * 2);
	ctx.closePath();
	ctx.fill();
}

function draw(){
	drawParticles();
	menu.draw();
	fields.forEach(drawCircle);
	emitters.forEach(drawCircle);
}

var animLoop = function(){
	clearScreen();
	update();
	draw();
	showFps();
	requestAnimFrame(animLoop);
}

//Fps counter
var oldTime = new Date();
var fps = 0;

function showFps(){
	ctx.fillStyle = "red";
	ctx.textAlign = "center";
	ctx.font = "30px Impact";
	ctx.fillText("fps:" + Math.floor(fps), canvas.width-200, canvas.height/6);
	var newTime = new Date();
	fps = 1000 / (newTime - oldTime);
	oldTime = newTime;
}

//Menu Class
function Menu(){
	this.options = ['Emitter', 'Field', 'Emitter Spread', 'Max Particles', 'Emission Rate'];
	this.currentOption = 0;
	this.angle = 0;
	this.magnitude = 2;
	this.mass = 0;
	this.spread = Math.PI / 32;
	this.auxSpread = 32;
}

Menu.prototype.changeOption = function(){
	this.currentOption += 1;
	this.currentOption = this.currentOption == this.options.length ? 0 : this.currentOption;
}

Menu.prototype.draw = function(){
	ctx.fillStyle = "white";
	ctx.textAlign = "center";
	ctx.font = "30px Impact";
	ctx.fillText(this.options[this.currentOption], canvas.width-200, canvas.height/11);
	ctx.font = "20px Impact";
	switch(this.options[this.currentOption]){
		case 'Emitter':
			ctx.fillText('Angle:' + this.angle + '  Speed:' + this.magnitude, canvas.width-200, canvas.height/8);
			break;
		case 'Field':
			ctx.fillText('Mass:' + this.mass, canvas.width-200, canvas.height/8);
			break;
		case 'Emitter Spread':
			ctx.fillText('Value:' + this.auxSpread, canvas.width-200, canvas.height/8);
			break;
		case 'Max Particles':
			ctx.fillText('Value:' + maxParticles, canvas.width-200, canvas.height/8);
			break;
		case 'Emission Rate':
			ctx.fillText('Value:' + emissionRate, canvas.width-200, canvas.height/8);
			break;
	}
}

Menu.prototype.executeCurrentOption = function(){
	switch(this.options[this.currentOption]){
		case 'Emitter':
			emitters.push(new Emitter(new Vector2(mouse.x, mouse.y), Vector2.fromAngle(this.angle, this.magnitude), this.spread));
			break;
		case 'Field':
			fields.push(new Field(new Vector2(mouse.x, mouse.y), this.mass));
			break;
	}
}

Menu.prototype.deleteFieldsOrEmitters = function(){
	var newFields = [];
	for(var i = 0; i < fields.length; i++){
		var field = fields[i];
		if(field.position.distance(mouse) > 15){
			newFields.push(field);
		}
	}
	fields = newFields;

	var newEmitters = [];
	for(var i = 0; i < emitters.length; i++){
		var emitter = emitters[i];
		if(emitter.position.distance(mouse) > 15){
			newEmitters.push(emitter);
		}
	}
	emitters = newEmitters;
}

Menu.prototype.changeValues = function(delta){
	switch(this.options[this.currentOption]){
		case 'Emitter':
			if(delta == 1){
				this.magnitude++;
				this.magnitude = this.magnitude > 15 ? -15 : this.magnitude;
			}else{
				this.angle += 0.20;
				this.angle = this.angle > 6.1 ? 0 : this.angle;
			}
			break;
		
		case 'Field':
			this.mass += delta * 5;
			this.mass = this.mass > 300 ? -300 : (this.mass < -300 ? 300 : this.mass);
			break;

		case 'Emitter Spread':
			this.auxSpread = clamp(this.auxSpread + delta, 1, 64);
			this.spread = Math.PI / this.auxSpread;
			break;

		case 'Max Particles':
			maxParticles = clamp(maxParticles + 50 * delta, 0, 30000)
			break;

		case 'Emission Rate':
			emissionRate = clamp(emissionRate + delta, 0, 30);
			break;
	}
}


//Events
canvas.addEventListener("mousemove", updateMouse);
function updateMouse(e){
	mouse.x = e.pageX;
	mouse.y = e.pageY;
}

canvas.addEventListener("mousewheel", mouseWheel, false);
canvas.addEventListener("DOMMouseScroll", mouseWheel, false);
function mouseWheel(e){
	var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
	menu.changeValues(delta);
	return false;
}

canvas.onmousedown = function(e){
	e.stopPropagation();
	e.preventDefault();
	e.cancelBubble = false;

	switch(e.button){
		case 0:
			menu.executeCurrentOption();
			break;
		case 1:
			menu.changeOption();
			break;
		case 2:
			menu.deleteFieldsOrEmitters();
			break;
	}
}

canvas.oncontextmenu = function(e){
	return false;
}

//Main function call
animLoop();
