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

//Mouse Detection %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
var mouse = new Vector2(-1000, -1000);
c.addEventListener("mousemove", updateMouse);
function updateMouse(e) {
	mouse.x = e.pageX;
	mouse.y = e.pageY;
}
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%


//Vector2 class %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
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

var v = new Vector2(200, 200);

function shiftPoint(p) {
  TweenLite.to(
    p,
    getRandom(1, 1),
    {
      x: getRandom(p.x - 3, p.x + 3),
      y: getRandom(p.y - 3, p.y + 3),
      ease: Circ.easeInOut,
      onComplete: function() {
        shiftPoint(p);
      }
    }
  );
}

shiftPoint(v);

var update = function() {
  ctx.clearRect(0, 0, c.width, c.height);
  ctx.fillRect(v.x, v.y, 100, 100);
  requestAnimFrame(update);
}

update();
