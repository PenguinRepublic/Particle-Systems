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
c.width  = 600;
c.height = 600;
var center = new Vector2(c.width/2, c.height/2);

var mouse = new Vector2(-1000, -1000);
c.addEventListener("mousemove", updateMouse);
function updateMouse(e) {
	mouse.x = e.pageX;
	mouse.y = e.pageY;
}

var clrScreen = function() {
	ctx.clearRect(0, 0, c.width, c.height)
	ctx.fillStyle = "black"
	ctx.fillRect(0, 0, c.width, c.height)
}

var drawMandelBrotSet = function() {

	var imageData = ctx.getImageData(0, 0, c.width, c.height)
	var pixels = imageData.data;
	var maxIterations = 100;

	for (var x = 0; x < c.width; x++) {
		for (var y = 0; y < c.height; y++) {

			var realComponent = mapIntoRange(x, 0, c.width, -2.5, 2.5)
			var imaginaryComponent = mapIntoRange(y, 0, c.height, -2.5, 2.5)
			var a = realComponent
			var b = imaginaryComponent

			var z = 0;
			// a += z*z;
			var n;
			for (n = 0; n < maxIterations; n++) {
				var aa = a*a - b*b
				var bb = 2*a*b
				a = aa + realComponent
				b = bb + imaginaryComponent
				if (Math.abs(a + b) > 16) {
					break;
				}
			}

			var bright = mapIntoRange(n, 0, maxIterations, 0, 255)
			if (n === maxIterations) {
				bright = 0
			}

			var i = (x + y * c.width) * 4
			pixels[i] = bright // red
			pixels[i+1] = bright // green
			pixels[i+2] = bright // blue
			pixels[i+3] = 255 // alpha
		}
	}
	ctx.putImageData(imageData, 0, 0);
}

clrScreen()
drawMandelBrotSet()


/* Main Function */
var update = function() {
	clrScreen();
	requestAnimFrame(update);
};

// update();

/**
 *
 *
 * @return
 */
function mandelbrotFunction(a, b) {

}

function rgbColor(r, g, b) {
	return "rgb(" + r + "," + g + "," + b + ")"
}
