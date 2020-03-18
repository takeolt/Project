//Declarations

var cvs = document.getElementById("canvas");
var ctx = cvs.getContext("2d");
var restart = document.getElementById("restart");

//events

window.addEventListener('resize', resizeCanvas, false);
document.addEventListener("mousemove", mouseMoveEffect);
document.addEventListener("click", mouseClickEffect)

// Variables

/* --> Images */
var ship = new Image();
var background = new Image();
var bullet = new Image();
var backGroundWidth;
var backGroundHeigh;
var mouse_x = 0;
var mouse_y = 0;
var test_p = new Image();
var monster_type_1 = new Image();

// Arrays

var bullets = [];
var enemy_array = [];

// booleans

var gameStart = true;
var shootAnimationOn = false;
var phase2 = false;
var phase1 = true;
var spawnEnemy = true;

// functions

function start() {

    resizeCanvas();

    ctx.drawImage(background, 0, 0, backGroundWidth, backGroundHeigh);
    ctx.drawImage(ship, mouse_x, mouse_y);
    //ctx.drawImage(test_p, mouse_x, mouse_y);
    

   // if(enemy_array.length > 0) {
     //   drawEnemies();
    //}

    if(shootAnimationOn) {
        drawBullets();

        if(bullets.length == 0) {
            shootAnimationOn = false;
        }
    }

    requestAnimationFrame(start);
}

function resizeCanvas() {

    backGroundWidth = window.innerWidth;
    backGroundHeigh = window.innerHeight;
    cvs.width = window.innerWidth;
    cvs.height = window.innerHeight;

    ship.src = "picture/spaceship_model_1.png";
    background.src = "picture/background1.jpg";
    bullet.src = "picture/bullet_model_1.jpg";
    test_p.src = "picture/temp.jpg";
    monster_type_1.src = "picture/monster_type_1.png";
}

function mouseMoveEffect(events) {
    var tempx = event.clientX;
    var tempy = event.clientY;

    mouse_x = tempx;
    mouse_y = tempy;

    
}

function mouseClickEffect(events) {

    var temp = bullets.length;

    bullets[temp] = {
        id : temp,
        x : mouse_x + 30,
        y1 : mouse_y + 7.5,
        y2 : mouse_y + 28
    }

    shootAnimationOn = true;
}


function drawBullets() {

    for(i = 0; i < bullets.length; i++) {

        ctx.drawImage(bullet, bullets[i].x, bullets[i].y1);
        ctx.drawImage(bullet, bullets[i].x, bullets[i].y2);

        bullets[i].x += 7;

    }

    if(bullets[0].x >= cvs.width) {
       bullets.shift();
    } 

    console.log(bullets.length);
}


function SpawnEnemies() {

    if(phase1) {
        var tempY = Math.floor(Math.random() * cvs.height);
        var size = enemy_array.length;

        if(tempY + monster_type_1.height > cvs.height) {
            tempY -= monster_type_1;
        }

        if(tempY < monster_type_1.height ) {
            tempY += monster_type_1.height;
        }

        enemy_array[size] = {
            enemy_type: "mob 1",
            enemy : monster_type_1,
            x : cvs.width,
            y : tempY
        }
    }
    

    if(gameStart) {
        gameStart = false;
        setTimeout(function(){phase1 = false; phase2 = true;}, (10*1000));
    }
}

function drawEnemies() {

    if(phase1) {
        for(i = 0; i < enemy_array.length; i++) {
            ctx.drawImage(enemy_array[i].enemy, enemy_array[i].x, enemy_array[i].y);
            enemy_array[i].x -= 3;
        }
    }
}

start();
