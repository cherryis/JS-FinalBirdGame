// Create the canvas
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
//document.body.appendChild(canvas);
	
// Score
let score = 0;
let gameFrame = 0;
ctx.font = "50px Helvetica";
let gameOver = false;

//Mouse Interactivity
let canvasPosition = canvas.getBoundingClientRect();
let mouse = { //mouse holds data 
	x: canvas.width/2, //center of canvas x
	y: canvas.height/2, //center of canvas y
	click: false //mouse released or pressed
}
canvas.addEventListener('mousedown', function(event){
	mouse.click = true;
	mouse.x = event.x - canvasPosition.left; //mouse.x will be overridden with current x coordinate
	mouse.y = event.y - canvasPosition.top;
});
canvas.addEventListener('mouseup', function(event){
	mouse.click = false;
})
 
//Player       ------------------------------------------------------------
let playerLeft = new Image();
playerLeft.src = 'images/playerLeft.png'
let playerRight = new Image();
playerRight.src ='images/playerRight.png' //flipped img vertically

class Player {
	constructor(){
		this.x = canvas.width;
		this.y = canvas.height/2;
		this.radius = 50;
		this.angle = 0;
		// this.framex = 0;
		// this.framey = 0;
		// this.frame = 0;
		// this.spriteWidth = 140;
		// this.spriteHeight = 130;
	}
	update(){
		let distanceX = this.x - mouse.x;
		let distanceY = this.y - mouse.y; 
		let theta = Math.atan2(distanceY, distanceX);
		this.angle = theta;
		
		if (mouse.x != this.x) {
			this.x -= distanceX/20;  //negative direction, player speed : divided by small # is high speed
		}
		if (mouse.y != this.y) {
			this.y -= distanceY/20;
		}
	}
	draw(){
		if(mouse.click) {
			ctx.lineWidth = 0.2;
			ctx.beginPath();
			ctx.moveTo(this.x, this.y);
			ctx.lineTo(mouse.x, mouse.y);
		    // ctx.stroke();
		}
		// ctx.beginPath();
		// ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
		// ctx.closePath();
		// ctx.fillStyle = 'yellow';
		// ctx.fill(); 
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(this.angle);
		if (this.x >= mouse.x){
			ctx.drawImage(playerLeft, 0 - 60, 0 - 45, 140, 130); //image to use / position /customised size for using
		} else {
			ctx.drawImage(playerRight, 0 - 60, 0 - 45, 140, 130); //image to use / position /customised size for using
		}
		ctx.restore();

	}
	// drawEyes() {
	// 	let {x, y} = this;
	// 	ctx.beginPath();	//outline of white eye
	// 	ctx.arc(x-13, y-10, 8, 0, Math.PI*2);
	// 	ctx.arc(x+13, y-10, 8, 0, Math.PI*2);
	// 	ctx.fillStyle = '#b4ddfc';
	// 	ctx.fill();


	// 	ctx.beginPath();    // outline of black eye
	// 	ctx.arc(x-11, y-13, 4, 0, Math.PI*2);
	// 	ctx.arc(x+11, y-13, 4, 0, Math.PI*2);
	// 	ctx.fillStyle = '#200e09';
	// 	ctx.fill();	
	// }
}
let player = new Player();

// Bubbles
let bubblesArray = [];
let bubble = new Image();
bubble.src = 'images/peach.png'

class Bubbles {
	constructor(){
		this.x = Math.random() * canvas.width;
		this.y = canvas.height + 100;
		this.radius = 30;
		this.speed = Math.random() * 5 + 1; //random # between 1-6
		this.distance; //tracking indivisual bubble
		this.counted = false;
		this.sound = Math.random() < 0.5 ? 'sound1' : 'sound2';
	}
	update(){ //bubbles' movement
		this.y -= this.speed; //negative direction
		let distanceX = this.x - player.x;
		let distanceY = this.y - player.y;
		this.distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY); //calculate hypotenuse between player, each bubble distance
		 
	}
	draw(){
		// ctx.beginPath();
		// ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
		// ctx.closePath();
		// ctx.fillStyle = 'red';
		// ctx.fill(); 

		ctx.drawImage(bubble, this.x -70, this.y -75, 145, 145);
	}
	// drawEyes() {
	// 	let {x, y} = this;
	// 	ctx.beginPath();	//outline of white eye
	// 	ctx.arc(x-13, y-10, 8, 0, Math.PI*2);
	// 	ctx.arc(x+13, y-10, 8, 0, Math.PI*2);
	// 	ctx.fillStyle = '#b4ddfc';
	// 	ctx.fill();


	// 	ctx.beginPath();    // outline of black eye
	// 	ctx.arc(x-11, y-13, 4, 0, Math.PI*2);
	// 	ctx.arc(x+11, y-13, 4, 0, Math.PI*2);
	// 	ctx.fillStyle = '#200e09';
	// 	ctx.fill();	
	// }
}
//Audio sound
let bubblePop1 = document.createElement('audio');
bubblePop1.src = 'gainScore1.wav';
let bubblePop2 = document.createElement('audio');
bubblePop2.src = 'gainScore2.wav';  

function handleBubbles(){
	if(gameFrame % 50 == 0){
		bubblesArray.push(new Bubbles());
	}
	for(let i = 0; i < bubblesArray.length; i++){
		bubblesArray[i].update();
		bubblesArray[i].draw();
		if (bubblesArray[i].y < 0 - bubblesArray[i].radius * 2){
			bubblesArray.splice(i,1);
			i--;
		}
		// bubblesArray[i].drawEyes();
		else if (bubblesArray[i].distance < bubblesArray[i].radius + player.radius){
			if (!bubblesArray[i].counted){
				if (bubblesArray[i].sound == 'sound1'){
					bubblePop1.play();
				} else {
					bubblePop2.play();
				}
				score++; // if bubble array is true, gain 1 score 
				bubblesArray[i].counted = true;
				bubblesArray.splice(i,1); //removing eaten bubble
				i--;
			}
		}
	}
	
}
//----------------------------------------------------------------
// Enemies
let enemy = new Image();
enemy.src = 'images/enemyEagle.png'

class Enemy {
	constructor(){
		this.x = canvas.width + 200;
		this.y = Math.random() * (canvas.height - 150) + 90;
		this.radius = 60;
		this.speed = Math.random() * 2 + 2;
		this.frame = 0;
		this.frameX = 0;
		this.frameY = 0;
		this.spriteWidth = 974;
		this.spriteHeight = 1333;
	}
	draw(){
		// ctx.beginPath();
		// ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
		// ctx.closePath();
		// ctx.fillStyle = 'pink';
		// ctx.fill(); 
		ctx.drawImage(enemy, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight,
			this. spriteWidth, this.spriteHeight, this.x - 160, this.y - 100, 270, 270);
	}
	update(){ //enemys' movement
		this.x -= this.speed; //negative direction
		if (this.x < 0 - this.radius * 2 ){
			this.x = canvas.width + 200;
			this.y = Math.random() * (canvas.height - 150) + 90;
			this.speed = Math.random() * 2 + 2;
		}
		if (gameFrame % 5 == 0) {
			this.frame++;
			if (this.frame >= 4) this.frame = 0;
			if (this.frame == 3){  //index 3 is last image
				this.frameX = 0;
			} else {
				this.frameX++; //columns
			}
			if (this.frame < 3) this.frameY = 0;
		}
		//Collision with player
		let distanceX = this.x - player.x
		let distanceY = this.y - player.y;
		let distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY); //calculate hypotenuse between player, each bubble distance
		if (distance < this.radius + player.radius) {
			hadleGameOver();
		}

	}
}
let enemy1 = new Enemy();
function handleEnemy(){
	enemy1.update();
	enemy1.draw();
}
function hadleGameOver(){
	ctx.fillStyle = 'blue';
	ctx.fillText('GAME OVER, you reached score ' + score, 130, 250);
	gameOver = true;
}
// Demage Bubbles

let demageBubblesArray = [];
class DemageBubbles {
	constructor(){
		this.x = Math.random() * canvas.width;
		this.y = Math.random() * canvas.height;
		this.radius = 40;
		this.speed = Math.random() * 5 + 1; //random # between 1-6
		this.distance; //tracking indivisual bubble
		this.counted = false;
		this.sound = Math.random() < 0.5 ? 'sound1' : 'sound2';

	}
	update(){ //Demage bubbles' movement
		this.y -= this.speed; //negative direction
		let distanceX = this.x - player.x;
		let distanceY = this.y - player.y;
		this.distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY); //calculate hypotenuse between player, each bubble distance

	}
	draw(){
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
		ctx.closePath();
		ctx.fillStyle = 'black';
		ctx.fill(); 
	}
	drawEyes() {
		let {x, y} = this;
		ctx.beginPath();	//outline of white eye
		ctx.arc(x-13, y-10, 8, 0, Math.PI*2);
		ctx.arc(x+13, y-10, 8, 0, Math.PI*2);
		ctx.fillStyle = '#b4ddfc';
		ctx.fill();


		ctx.beginPath();    // outline of black eye
		ctx.arc(x-11, y-13, 4, 0, Math.PI*2);
		ctx.arc(x+11, y-13, 4, 0, Math.PI*2);
		ctx.fillStyle = '#200e09';
		ctx.fill();	
	}
}
//Audio sound - lost score
let bubblePop3 = document.createElement('audio');
bubblePop3.src = 'losingScore.mp3';
let bubblePop4 = document.createElement('audio');
bubblePop4.src = 'gameOver.mp3';

function demageHandleBubbles(){
	if(gameFrame % 50 == 0){
		demageBubblesArray.push(new DemageBubbles());
	}

	for(let i = 0; i < demageBubblesArray.length; i++){
		demageBubblesArray[i].update();
		demageBubblesArray[i].draw();
		demageBubblesArray[i].drawEyes();
		if (demageBubblesArray[i].y < 0 - demageBubblesArray[i].radius * 2){
			demageBubblesArray.splice(i,1); //removing eaten bubble	
			i--;
		}
		else if (demageBubblesArray[i].distance < demageBubblesArray[i].radius + player.radius){
			if (!demageBubblesArray[i].counted){
				if (demageBubblesArray[i].sound == 'sound1'){
					bubblePop3.play();
				} else { 
					bubblePop4.play();
				}
				score--; // if bubble array is true, lost 1 score
				demageBubblesArray[i].counted = true;
				demageBubblesArray.splice(i,1); //removing eaten bubble	
				i--;
				if (score == 0) hadleGameOver();

			} 					
		}
	}
}
// //Ball image
// let raf;
// let ball = {
// 	x: 100, 
// 	y: 100,
// 	vx: 5, 
// 	vy: 2,
// 	radius: 28,
// 	draw: function() {
// 		ctx.beginPath();
// 		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
// 		ctx.closePath();
// 		ctx.fillStyle = 'red';
// 		ctx.fill();  
// 	},
// 	drawEyes: function () {
// 		let {x, y} = this;
// 		ctx.beginPath();	//outline of white eye
// 		ctx.arc(x-13, y-10, 8, 0, Math.PI*2, false);
//         ctx.arc(x+13, y-10, 8, 0, Math.PI*2, false);
//         ctx.fillStyle = '#b4ddfc';
//         ctx.fill();


//         ctx.beginPath();    // outline of black eye
//         ctx.arc(x-11, y-13, 4, 0, Math.PI*2, false);
//         ctx.arc(x+11, y-13, 4, 0, Math.PI*2, false);
//         ctx.fillStyle = '#200e09';
//         ctx.fill();	
// 	}
// };

// function draw() {
// 	ctx.clearRect(0,0, canvas.width, canvas.height); //clear old circles
	
// 	ball.draw();
// 	ball.drawEyes();
// 	ball.x += ball.vx;
// 	ball.y += ball.vy;

// 	if (ball.x + ball.vx > canvas.width || 
// 		ball.x + ball.vx < 0) { ball.vx = -ball.vx;	}
// 	if (ball.y + ball.vy > canvas.width || 
// 		ball.y + ball.vy < 0) { ball.vy = -ball.vy;	}  

//     raf = window.requestAnimationFrame(draw);	
	
// }


// canvas.addEventListener('mouseover', function(e) {
//     raf = window.requestAnimationFrame(draw);
// });

// canvas.addEventListener('mouseout', function(e) {
//     window.cancelAnimationFrame(raf);
				
// });

// ball.draw();



// Animation Loop
function animate(){
	ctx.clearRect(0,0, canvas.width, canvas.height); //clear old circles
	handleBubbles();
	demageHandleBubbles();
	player.update();
	player.draw();
	handleEnemy();
	// player.drawEyes();
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.fillText('SCORE: ' + score, 10, 50);
	gameFrame++;
	if (!gameOver) requestAnimationFrame(animate); //recursion
}
animate();

window.addEventListener('resize', function(){
	canvasPosition = canvas.getBoundingClientRect();
});
