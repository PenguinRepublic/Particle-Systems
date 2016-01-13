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

//makes sure x stays on the range [a, b]
function clamp(x, a, b){
	return Math.max(a, Math.min(b, x));
}