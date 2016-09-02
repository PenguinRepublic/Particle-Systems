function Vector2(x, y) {
	this.x = x || 0.0;
	this.y = y || 0.0;
}

Vector2.prototype.lerp = function(v, t) {
	this.x = lerp(this.x, v.x, t);
	this.y = lerp(this.y, v.y, t);
}

Vector2.prototype.distance = function(v) {
	return Math.sqrt(Math.pow(v.x - this.x, 2) + Math.pow(v.y - this.y, 2));
}

Vector2.prototype.copy = function(v) {
	this.x = v.x;
	this.y = v.y;
}

Vector2.prototype.getNewPositionFrom = function(v) {
	this.x = v.x + (randomSign() * getRandom(minMovingValue, maxMovingValue));
	this.y = v.y + (randomSign() * getRandom(minMovingValue, maxMovingValue));
	return new Vector2(this.x, this.y);
}
