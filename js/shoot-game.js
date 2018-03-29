var enemies = [];
var bullets = [];

let score = 0, gameStatus = 1, start = "no";  // 0 for Game Lost, 1 for Game continue

var game = {
	factor : 1 //max level of game is 5 otherwise will lag
};

var mycanvas = {
	height : $("#mycanvas").height(),
	width : $("#mycanvas").width()
};

var destroyer = {
	speed : game.factor*mycanvas.width/50,
	top : $("#destroyer").position().top,
	left : $("#destroyer").position().left,
	height : $("#destroyer").height(),
	width : $("#destroyer").width()
};

var bulletObject = {
	width : 10,
	height : 30,    //if changing bullet's height change in css too
	speed : 50
};

var enemy = {
	width : 50,
	height : 50,
	speed : 1,
	top : 1,
	left : 1,
};

$("#play").on('click', function(){
	start = "yes";
	$("#play").empty();
	$("#play").html('<h2>THE GAME IS ON!!!</h2>');
	$("#left").removeClass('disabled');
	$("#right").removeClass('disabled');
	$("#fire").removeClass('disabled');
});

window.addEventListener('keydown', pressKey);

function pressKey(event){
	//console.log("Top: " + destroyer.top + " Left: " + destroyer.left + "canvas width: " + mycanvas.width);
	if(start=="yes"){
		if(event.keyCode == 39 && destroyer.left>=0 && destroyer.left<mycanvas.width-50){
			$("#destroyer").animate({ left : "+=5px" }, destroyer.speed/5);
			destroyer.left += 5;
		}
		if(event.keyCode == 37 && destroyer.left>0 && destroyer.left<=mycanvas.width-50){
			$("#destroyer").animate({ left : "-=5px" }, destroyer.speed/5);
			destroyer.left -= 5;
		}
		if(event.keyCode == 96){
			fireFunction();
		}
	}
};

$("#fire").on('click', () => {
	if(start=="yes"){fireFunction();}
});


$("#left").on('click', () => {
	if( destroyer.left>0 && destroyer.left<=mycanvas.width-50 && start=="yes"){
		$("#destroyer").animate({ left : "-=5px" }, destroyer.speed/5);
		destroyer.left -= 5;
	}
});

$("#right").on('click', () => {
	if(destroyer.left>=0 && destroyer.left<mycanvas.width-50 && start=="yes"){
		$("#destroyer").animate({ left : "+=5px" }, destroyer.speed/5);
		destroyer.left += 5;
	}
});

var fireFunction =  function(){
	var bulletElement = $('<div class="bullet"></div>');
	$(".positioned-element").append(bulletElement);
	//console.log("destroyerPosition: " + destroyer.left );
	bullets.push(bulletElement);
	//console.log("Bullets: " + bullets);
	bulletElement.css({
		'left' : destroyer.left + destroyer.width/2 - bulletObject.width/2 + 'px',
		'top' : destroyer.top + 'px',
		'width' : bulletObject.width + 'px',
  		'height' : bulletObject.height + 'px',
  		'position' : 'absolute',
  		'background-color' : 'red'
	});
	
	bulletElement.animate({
		'top' : "0px"
	},{
		duration : 2000,
		easing : "linear",
		complete : () => {
			removeBullets(bulletElement);
		}
	});
};

function removeBullets(b){
	var k = bullets.indexOf(b);
	if(k!==-1){bullets.splice(k, 1);}
	b.remove();
};

function enemyMovement() {
	var enemyElement = $('<div class="enemy"></div>');
	$(".positioned-element").append(enemyElement);
	//console.log("enemy.width " + enemy.width + " enemy.left: " + enemy.left);
	enemies.push(enemyElement);
	//console.log("Enemies: " + enemies);
	const enemyTop = enemy.top*Math.floor(Math.random()*50);
	const enemyLeft = enemy.left*Math.floor(Math.random()*(mycanvas.width - 50 + 1));
	enemySpeed = enemy.speed*Math.floor(1+Math.random()*5)*1000*5000;
	enemyElement.css({
		'width' : enemy.width + 'px',
		'height' : enemy.height + 'px',
		'top' : enemyTop + 'px',
		'left' : enemyLeft + 'px'
	});
	enemyElement.animate({
		'top' : mycanvas.height + $("#upper-offset").height() - enemy.height - destroyer.height + 'px'
	}, {
		duration : enemySpeed/(mycanvas.height-enemyTop),
		easing :  "linear",
		complete : function(){
			if(enemyElement.position().top==mycanvas.height + $("#upper-offset").height() - enemy.height - destroyer.height){
				removeEnemy(enemyElement);
				gameOver();
			}
		},
		start : () => {
			checkForCollision();
		}
	});
};

var repeatEnemies = window.setInterval( () => {
		let t = Math.floor(1+Math.random());
		for(let i=0;i<t; i++){if(gameStatus==1 && start=="yes"){enemyMovement();}}
	}
,5000);

function removeEnemy(e) {
	var k = enemies.indexOf(e);
	if(k!==-1){enemies.splice(k, 1);}
	e.remove();
};

function checkForCollision() {
	bullets.forEach( (b) => {
		enemies.forEach( (e) => {
			if( checkTop(e,b) && ( check1(e, b) || check2(e, b) ) ){
				score = score + 1;
				$("#upper-offset").html("<h2 align='right'>SCORE: " + score + "</h2>");
				e.clearQueue();
				b.clearQueue();
				removeEnemy(e);
				removeBullets(b);
				b.clearQueue();e.clearQueue();
				return;
			}
		});
	});
		
};

var checks = window.setInterval( () => {
		checkForCollision();
	}, 50);

function checkTop(e, b){
	if(b.position().top-e.position().top <= enemy.height){return true;}
	else{return false;}
};

function check1(e, b){
	if( b.position().left - e.position().left < enemy.width && b.position().left >= e.position().left ){return true;}
	else{return false;}
};

function check2(e, b){
	if( e.position().left - b.position().left < bulletObject.width && e.position().left > b.position().left ){return true;}
	else{return false;}
}

function gameOver() {
	$("#game").clearQueue();
	$("#fire").attr("disabled", "disabled");
	$("#left").attr("disabled", "disabled");
	$("#right").attr("disabled", "disabled");
	$("#game").html("<center><h1>GAME OVER!!!</h1><h2>Score: " + score + "</h2><p>Refresh To Play Again!!!</p></center>");
	$("#play").empty();
	gameStatus = 0;
};




