var cvs = document.querySelector("canvas");
var ctx = cvs.getContext("2d");
var restart = document.getElementById("restart");

// Variables

var time = 0.001;

/* --> Images */
var ship = new Image();
var background = new Image();

ship.src = "picture/spaceship.png";
background.src = "picture/background1.jpg";



// functions


function start() {

    ctx.drawImage(background,0,0);

    requestAnimationFrame(start);
}



start();
