var cvs = document.getElementById("canvas");
var ctx = cvs.getContext("2d");
var restart = document.getElementById('restart');

// load images and set source

var main_figure1 = new Image();
var bg = new Image();
var fg_bottom = new Image();
var main_figure2 = new Image();
var fg_top = new Image();
var rook = new Image();
var knight = new Image();
var bishop = new Image();
var pawn = new Image();
var queen = new Image();
var knight_enemy = new Image();

main_figure2.src = "images/sur1.png";
main_figure1.src = "images/mangnus_happy2.png";
bg.src = "images/bakgrunn.jpg";
fg_bottom.src = "images/borders_bottom.png";
fg_top.src = "images/borders_up.png";
rook.src = "images/bullet1.png";
pawn.src = "images/bullet4.png";
knight_enemy.src = "images/enemy.png";


// variables such as integers, strings, booleans

var bX = 10;
var bY = 150;
var score = 0;
var bl1X = bX;
var bl1Y = bY;
var glob = 0;
var special_bullet = false;
var special_bullet_amount = 0;
var upgraded_bullet;
var spawn_special_bullet = false;
var amount_of_power_ups = 0;
var enemy_amount = 0;
var spawn_enemy = false;
var game_start = true;
var count_down_ready = true;
var count_down_3 = true;
var count_down_2 = true;
var count_down_1 = true;
var shoot_counter = 0;
var request_id;
var game_over = false;
var timout = false;
var bullet_hit_enemy = false;

// audio files and set source

var shoot = new Audio();
var scor = new Audio();
var powerUp = new Audio();

powerUp.src = "sounds/powerUP.wav";
shoot.src = "sounds/shoot_sound.wav";
scor.src = "sounds/score.mp3";

// events

document.addEventListener("keydown", keysWSAD);
document.addEventListener("mousemove", mouseMove);
document.addEventListener("click", mouseClickEffect);


// arrays

var bullet_location = [];
var collected_special_bullet_array = [];
var special_bullets_array = [];
var special_bullet_types = [rook, queen, bishop, knight];
var enemy_array = [];
var start_count_down_array = [
    {
        text : "Ready",
        type : "40px Verdana",
        size : 40,
        x : (cvs.width/2) - 100,
        y : cvs.height/2,
        next_x : 0.7
    }, {
        text : "3",
        type : "45px Verdana",
        size : 40,
        x : (cvs.width/2) - 60,
        y : cvs.height/2,
        next_x : 0.1
    },{
        text : "2",
        type : "40px Verdana",
        size : 40,
        x : (cvs.width/2) - 60,
        y : cvs.height/2,
        next_x : 0.1
    },
    {
        text : "1",
        type : "40px Verdana",
        size : 40,
        x : (cvs.width/2) - 60,
        y : cvs.height/2,
        next_x : 0.1
    },{
        text : "GO!!",
        type : "60px Verdana",
        size : 40,
        x : (cvs.width/2) - 90,
        y : cvs.height/2 + 20,
        next_x : 0.6
    }

];


// functions

function startFunction(){

    ctx.drawImage(bg,0,0);
    ctx.drawImage(fg_bottom,0,cvs.height - fg_bottom.height+2);
    ctx.drawImage(fg_top,0,0);

    if(spawn_special_bullet) {
        spawn_special_bullet = false;
        setTimeout(function (){makeSpecialBullet();},(Math.floor(Math.random() * 52)) * 1000);
    }

    if(spawn_enemy || enemy_array.length > 0) {
        SpawnEnemy();
        drawEnemy();
    }

    if(shoot_counter){
        drawSimpleShoots();
    }

    if(special_bullet || collected_special_bullet_array.length > 0) {
       // drawUpgradedShoots();
    }

    if (special_bullets_array.length > 0) {
        drawPowerUpAndPutATimer();
    }

    drawMainFigure();

    drawScoreText();

    if(game_start) {
        initializeCountdown();
    }

    request_id = requestAnimationFrame(startFunction);

    if(game_over) {
        cancelAnimationFrame(request_id);
    }
}

function mouseMove(event){
    var mouse_x = event.clientX;
    var mouse_y = event.clientY;
    bX = mouse_x;
    bY = mouse_y;
}

function keysWSAD(event){
    var x = event.key;

    if(x === "w"){
        bY -= 20;
    }

    else if (x === "s") {
        bY += 20;
    }
    else if(x === "a") {
        bX -= 20;
    }
    else if(x === "d") {
        bX += 20;
    }

}

function mouseClickEffect() {
    if(game_over){
        game_over = false;
        location.reload();
    }
    else if(!special_bullet) {
        glob = 7;
        var play_promise = shoot.play();
        play_promise.catch(function (error) { console.log(error) });
        bl1X = bX;
        bl1Y = bY;
        bullet_location[shoot_counter] = {
            bullet_name: "pawn",
            type: pawn,
            information: [
                {
                    x: bX,
                    y: bY
                }
            ]
        };
        shoot_counter++;
    }
}

function checkIfMainFigureHitTheFigure(x , y, figure_width, figure_height) {
    return bX + main_figure1.width >= x && bX <= x + figure_width && bY <= y + figure_height && bY + main_figure1.height
        >= y;
}

function checkIfBulletHitAEnemy(x1, y1 , fig_height, fig_width, x2, y2, en_height, en_width) {

    return x1 + fig_height >= x2 && x1 <= x2 + en_width && y1 <= y2 + en_height && y1 + fig_height >= y2;
}

function makeSpecialBullet(){
    spawn_special_bullet = true;
    var temp_y_coordinate = Math.floor(Math.random() * cvs.height);

    if (temp_y_coordinate === bg.height) {
        temp_y_coordinate -= rook.height;
    }

    special_bullets_array[special_bullet_amount] = {
        bullet : rook,
        x : cvs.width,
        y : temp_y_coordinate
    };
    special_bullet_amount++;
}

function SpawnEnemy(){
    if(spawn_enemy) {
        var tempY = Math.floor(Math.random() * cvs.height);

        if(tempY + knight_enemy.height > cvs.height) {
            tempY -= knight_enemy.height;
        }

        enemy_array[enemy_amount] = {
            enemy_pic_name : "knight",
            enemy_type : knight_enemy,
            x : cvs.width,
            y : tempY
        };

        enemy_amount++;
        spawn_enemy = false;

        setTimeout(function(){spawn_enemy = true},(Math.floor(Math.random() * 20)) * 1000);
    }
}

function initializeTimeoutForCountdown(){
    setTimeout(
        function(){
            spawn_enemy = true;
            game_start = false;
            spawn_special_bullet = true;
        },
        6000
    );
}

function initializeSpecialBullet(bullet_type) {
    if (bullet_type === pawn) {

    }
    else if(bullet_type === rook) {
        bullet_location[shoot_counter] = {
            bullet_name: "rook",
            type: rook,
            information: [
                {
                    x1: bX,
                    y1: bY,
                    x2: bX,
                    y2: bY
                }
            ]
        };
        shoot_counter++;
    }
    else if(bullet_type === queen) {

    }
    else if(bullet_type === bishop) {

    }
    else {

    }
}

function initializeCountdown() {

    if(count_down_ready){
        if(start_count_down_array[0].size < 0) {
            count_down_ready = false;
        }
        else {
            drawTextForCountdown(0);
        }
    }
    else if(count_down_3){
        if(start_count_down_array[1].size < 0) {
            count_down_3 = false;
        }
        else {
            drawTextForCountdown(1)
        }
    }
    else if (count_down_2) {
        if(start_count_down_array[2].size < 0) {
            count_down_2 = false;
        }
        else {
            drawTextForCountdown(2)
        }
    }
    else if (count_down_1) {
        if(start_count_down_array[3].size < 0) {
            count_down_1 = false;
        }
        else {
            drawTextForCountdown(3)
        }
    }
    else {
        if(start_count_down_array[4].size < 0) {
            count_down_1 = false;
            game_start = false;

        }
        else {
            drawTextForCountdown(4)
        }
    }
}

function drawEnemy(){
    var temp = 0;

    while(temp < enemy_array.length) {

        if(checkIfMainFigureHitTheFigure(enemy_array[temp].x, enemy_array[temp].y,
            enemy_array[temp].enemy_type.width, enemy_array[temp].enemy_type.height)){
            drawGameOver();
        }

        if(enemy_array[temp].x === 0) {
            enemy_array.slice(temp,1);
            enemy_amount--;
            continue;
        }
        ctx.drawImage(enemy_array[temp].enemy_type, enemy_array[temp].x, enemy_array[temp].y);
        enemy_array[temp].x -= 3;
        temp++;
    }
}

function drawGameOver() {
    ctx.font = "100px Veranda";
    ctx.fillStyle = "#002b80";
    ctx.fillText("GAME OVER", 300, 300);
    ctx.font = "20px Veranda";
    ctx.fillStyle = "#002b80";
    restart.innerText = "To restart click on the screen";
    game_over = true;
}

function drawPowerUpAndPutATimer() {
    var temp = 0;
    while (temp < special_bullets_array.length) {
        if (checkIfMainFigureHitTheFigure(special_bullets_array[temp].x, special_bullets_array[temp].y, rook.width,
            rook.height)) {
            upgraded_bullet = special_bullets_array[temp].bullet;
            special_bullet = true;
            amount_of_power_ups++;

            if (upgraded_bullet === rook) {
                initializeSpecialBullet(upgraded_bullet);
                score += 10;
                setTimeout(
                    function(){
                        if(amount_of_power_ups - 1 === 0){
                            special_bullet = false;
                            amount_of_power_ups--;
                        }
                        else{
                            amount_of_power_ups--;
                        }
                    },
                    3 * 1000
                );
            }
            else if (upgraded_bullet === knight) {
                setTimeout(
                    function(){
                        amount_of_power_ups--;
                        if(amount_of_power_ups === 0){
                            special_bullet = false;
                        }
                    },
                    5 * 1000
                );
            }
            else if (upgraded_bullet === queen) {
                setTimeout(
                    function(){
                        amount_of_power_ups--;
                        if(amount_of_power_ups === 0){
                            special_bullet = false;
                        }
                    },
                    8 * 1000
                );
            }
            else {
                setTimeout(
                    function(){
                        amount_of_power_ups--;
                        if(amount_of_power_ups === 0) {
                            special_bullet = false;
                        }
                    },
                    4 * 1000
                );
            }

            special_bullets_array.splice(temp, 1);
            special_bullet_amount--;
            var play_promise = powerUp.play();
            // i have to fix it somehow
            play_promise.catch(function (error) { console.log(error.message) });

        }
        else if (special_bullets_array[temp].x === 0) {
            special_bullets_array.splice(temp, 1);
            special_bullet_amount--;
        }
        else {
            ctx.drawImage(special_bullets_array[temp].bullet,special_bullets_array[temp].x,
                special_bullets_array[temp].y);
            special_bullets_array[temp].x--;
            temp++;
        }
    }
}

function drawSimpleShoots() {
    if (special_bullet) {
        if(upgraded_bullet === rook && !timout) {
            timout = true;
            setTimeout(function () {initializeSpecialBullet(rook); timout = false;}, 500);
        }
        else if (upgraded_bullet === queen) {

        }
        else if (upgraded_bullet === bishop) {

        }
        else {

        }
    }
    var a = 0;
    while (a < bullet_location.length) {

       if(enemy_array.length > 0) {
            var temp = 0;
            var play_promise;
                while (temp < enemy_array.length) {
                    if(bullet_location[a].bullet_name === "pawn") {
                        if(checkIfBulletHitAEnemy(bullet_location[a].information[0].x,
                            bullet_location[a].information[0].y, pawn.height, pawn.width, enemy_array[temp].x,
                            enemy_array[temp].y, knight_enemy.height, knight_enemy.width)){
                            score += 10;
                            enemy_array.splice(temp, 1);
                            enemy_amount--;
                            bullet_location.splice(a, 1);
                            shoot_counter--;
                            bullet_hit_enemy = true;
                            play_promise = scor.play();
                            play_promise.catch(function (error) { console.log(error.message)});
                            break;
                        }
                    }
                    else if(bullet_location[a].bullet_name === "rook") {
                        if(checkIfBulletHitAEnemy(bullet_location[a].information[0].x1, bullet_location[a].information
                        [0].y1, rook.height, rook.width, enemy_array[temp].x, enemy_array[temp].y, knight_enemy.height
                        , knight_enemy.width)) {
                            bullet_location[0].information[0].x1 = cvs.width + 2;
                            score += 10;
                            play_promise = scor.play();
                            play_promise.catch(function (error) { console.log(error.message) });
                            enemy_array.splice(temp, 1);
                            enemy_amount--;
                            break;
                        }
                        else if(checkIfBulletHitAEnemy(bullet_location[a].information[0].x2, bullet_location[a].information
                                [0].y2, rook.height, rook.width, enemy_array[temp].x, enemy_array[temp].y, knight_enemy.height
                            , knight_enemy.width)) {

                            bullet_location[0].information[0].x1 = -1;
                            score += 10;
                            play_promise = scor.play();
                            play_promise.catch(function (error) { console.log(error.message) });
                            enemy_array.splice(temp, 1);
                            enemy_amount--;
                            break;
                        }
                    }
                    temp++;
                }
                if(bullet_hit_enemy){
                    bullet_hit_enemy = false;
                    continue;
                }
        }

        if(bullet_location[a].bullet_name === "pawn") {
            if(bullet_location[a].information[0].x > cvs.width) {
                bullet_location.splice(a, 1);
                shoot_counter--;
                continue;
            }

            ctx.drawImage(bullet_location[a].type, bullet_location[a].information[0].x + 20,
                bullet_location[a].information[0].y + 10);
            bullet_location[a].information[0].x += 10;
            a++;
        }

        else if(bullet_location[a].bullet_name === "rook") {
            if(!(bullet_location[a].information[0].x1 >= cvs.width)){
                ctx.drawImage(bullet_location[a].type, bullet_location[a].information[0].x1 + 10,
                    bullet_location[a].information[0].y1 + 10);
                bullet_location[a].information[0].x1 += 10;
            }
            if(!(bullet_location[a].information[0].x2  + rook.width <= 0)) {
                ctx.drawImage(bullet_location[a].type, bullet_location[a].information[0].x2 - 10,
                    bullet_location[a].information[0].y2 + 10);
                bullet_location[a].information[0].x2 -= 10;
            }

            if((bullet_location[a].information[0].x1 >= cvs.width) &&
                (bullet_location[a].information[0].x2  + rook.width <= 0)) {
                bullet_location.splice(a, 1);
                shoot_counter--;
                continue;
            }
            a++;
        }

    }
}

function drawScoreText() {
    ctx.fillStyle = "#00099";
    ctx.font = "30px Verdana";
    ctx.fillText("Score : " + score,10,cvs.height-20);
}

function drawMainFigure() {
    if(glob > 0) {
        glob = glob - 1;
        ctx.drawImage(main_figure2,bX,bY);
    }
    else {
        if (special_bullet) {
            ctx.drawImage(main_figure2,bX,bY);
        }
        else {
            ctx.drawImage(main_figure1,bX,bY);
        }
    }
}

function drawTextForCountdown(count) {
    var my_gradient = ctx.createLinearGradient(0, 0, 0, 1050);
    my_gradient.addColorStop(0, "red");
    my_gradient.addColorStop(0.5, "blue");
    my_gradient.addColorStop(1, "black");
    ctx.font = start_count_down_array[count].type;
    ctx.fillStyle = my_gradient;
    ctx.fillText(start_count_down_array[count].text, start_count_down_array[count].x,
        start_count_down_array[count].y);
    start_count_down_array[count].y = start_count_down_array[count].y + 0.5;
    start_count_down_array[count].x = start_count_down_array[count].x + start_count_down_array[count].next_x;
    start_count_down_array[count].size = start_count_down_array[count].size - 0.6;
    start_count_down_array[count].type = start_count_down_array[count].size + "px Verdana";
}

initializeTimeoutForCountdown();
startFunction();
