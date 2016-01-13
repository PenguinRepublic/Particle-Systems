
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

Vector2.prototype.add = function(v){
	this.x += v.x;
	this.y += v.y;
}

Vector2.prototype.getMagnitude = function(){
	return Math.sqrt(this.x * this.x + this.y * this.y);
}

Vector2.prototype.getAngle = function(){
	return Math.atan2(this.y, this.x);
}

Vector2.fromAngle = function(angle, magnitude){
	return new Vector2(magnitude * Math.cos(angle), magnitude * Math.sin(angle));
}