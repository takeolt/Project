//Declarations

var cvs = document.getElementById("canvas");
var ctx = cvs.getContext("2d");
var restart = document.getElementById("restart");

//events

window.addEventListener('resize', resizeCanvas, false);
document.addEventListener("mousemove", mouseMove);

// Variables

/* --> Images */
var ship = new Image();
var background = new Image();
var bullet = new Image();
var backGroundWidth;
var backGroundHeigh;
var mouse_x = 0;
var mouse_y = 0;

// functions

function start() {

    resizeCanvas();

    ctx.drawImage(background,0,0, backGroundWidth, backGroundHeigh);
    ctx.drawImage(ship,mouse_x,mouse_y);
    ctx.drawImage(bullet,mouse_x + 40,mouse_y);

    requestAnimationFrame(start);
}

function resizeCanvas() {

    backGroundWidth = window.innerWidth;
    backGroundHeigh = window.innerHeight;
    cvs.width = window.innerWidth;
    cvs.height = window.innerHeight;

    ship.src = "picture/spaceship.png";
    background.src = "picture/background1.jpg";
    bullet.src = "picture/bullet.jpg";
}

function mouseMove(events) {
    var tempx = event.clientX;
    var tempy = event.clientY;

    mouse_x = tempx;
    mouse_y = tempy;
}



start();
