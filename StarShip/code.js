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
var simple_bullet = new Image();
var back_Ground_Width;
var back_Ground_Heigh;
var mouse_x = 0;
var mouse_y = 0;
var test_p = new Image();
var monster_type_1 = new Image();

// Arrays

var bullets = [];
var enemy_array = [];

// booleans

var game_Start = true;
var shoot_AnimationOn = false;
var level2 = false;
var level1 = true;
var spawn_Enemy = true;
var timer_out_draw_enemy = true;

// functions

function start() {

    resizeCanvas();

    if(mouse_x + ship.width >= cvs.width) {
        mouse_x = cvs.width - ship.width;
    }
    if(mouse_y + ship.height >= cvs.height) {
        mouse_y = cvs.height - ship.height;
    }

    ctx.drawImage(background, 0, 0, back_Ground_Width, back_Ground_Heigh);
    ctx.drawImage(ship, mouse_x, mouse_y);
    //ctx.drawImage(test_p, mouse_x, mouse_y);

    checkForBulletContact();
    
    if(timer_out_draw_enemy && level1) {
        SpawnEnemies();
        timer_out_draw_enemy = false;
        setTimeout(function(){timer_out_draw_enemy = true}, 1000);
    }

    if(timer_out_draw_enemy && level2) {
        
    }

   if(enemy_array.length > 0) {
        drawEnemies();
    }

    if(shoot_AnimationOn) {
        drawBullets();

        if(bullets.length == 0) {
            shoot_AnimationOn = false;
        }
    }

    requestAnimationFrame(start);
}

function resizeCanvas() {

    back_Ground_Width = window.innerWidth;
    back_Ground_Heigh = window.innerHeight;
    cvs.width = window.innerWidth;
    cvs.height = window.innerHeight;

    ship.src = "picture/spaceship_model_1.png";
    background.src = "picture/background1.jpg";
    simple_bullet.src = "picture/bullet_model_1.jpg";
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
        type : simple_bullet,
        id : temp,
        x : mouse_x + 30,
        y : mouse_y + 7.5
    }

    temp++;

    bullets[temp] = {
        type : simple_bullet,
        id : temp,
        x : mouse_x + 30,
        y : mouse_y + 28
    }
    shoot_AnimationOn = true;
}


function drawBullets() {

    for(i = 0; i < bullets.length; i++) {
        
      
        ctx.drawImage(simple_bullet, bullets[i].x, bullets[i].y);
        
        bullets[i].x += 5;

    }

    if(bullets[0].x >= cvs.width) {
       bullets.shift(0,1);
    } 


}


function SpawnEnemies() {

    if(level1) {
        var tempY = Math.floor(Math.random() * cvs.height);
        var size = enemy_array.length;

        if(tempY + monster_type_1.height > cvs.height) {
            tempY -= monster_type_1.height;
        }

        if(tempY < monster_type_1.height ) {
            tempY += monster_type_1.height;
        }

        enemy_array[size] = {
            level: "level_1",
            type : monster_type_1,
            x : cvs.width,
            y : tempY
        }
    }
    

    if(game_Start) {
        game_Start = false;
        setTimeout(function(){level1 = false; level2 = true;}, (100*1000));
    }
}

function drawEnemies() {

    if(enemy_array[0].level == "level_1") {

        for(i = 0; i < enemy_array.length; i++) {

            if(enemy_array[i].level.localeCompare("level_1") != 0) {   
                break;
            }

            ctx.drawImage(enemy_array[i].type, enemy_array[i].x, enemy_array[i].y);
            enemy_array[i].x -= 3;
        }
    }

    if(enemy_array[0].x == 0){
        enemy_array.slice(1,0);
    } 
}

function checkForBulletContact() {
    for(i = 0; i < bullets.length; i++) {
        for(a = 0; a < enemy_array.length; a++) {
            if(bullets[i].x + bullets[i].type.width >= enemy_array[a].x && bullets[i].x <= enemy_array[a].x + enemy_array[a].type.width
                && bullets[i].y - bullets[i].type.height <= enemy_array[a].y && bullets[i].y + 1 >= enemy_array[a].y - enemy_array[a].type.height) {
                    enemy_array.slice(1,a);
                    console.log("Hit");
            }
        }
    }
}

start();
