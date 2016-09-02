function getRandom(min, max) {
	return min + Math.random() * (max - min);
}

function randomDistributing(min, max) {
	return min + Math.random() * max;
}

function getRandomInt(min, max) {
	return Math.floor(min + Math.random() * (max - min + 1));
}

function lerp(a, b, f) {
	return a + f * (b - a);
}

function randomSign() {
	return Math.random() < 0.5 ? -1 : 1;
}

function ease(x) {
	var a = 1;
	return Math.pow(x, a) / (Math.pow(x, a) + Math.pow(1-x, a));
}

function clamp(n, min, max) {
	return Math.max(a, Math.min(n, max));
}

function mapIntoRange(value, low1, high1, low2, high2) {
	return low2 + (high2-low2) * ((value-low1) / (high1-low1));
}
