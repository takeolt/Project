
/*---> variables -----------*/
var ship = new Image(40, 40);
var width = 40;
var heigh = 40;


function borderCheck(){
    if(mouse_x + ship.width >= cvs.width) {
        mouse_x = cvs.width - ship.width;
    }

    if(mouse_y + ship.height >= cvs.height) {
        mouse_y = cvs.height - ship.height;
    }
}

function reSizeShipHeigh(back_Ground_Heigh) {
    heigh = back_Ground_Heigh / 600; 
    
    heigh = heigh * 40;


    ship = new Image(width, heigh);

    return ship;
}

function reSizeShipWidth(back_Ground_Width) {
    width = (back_Ground_Width / 1000);

    width = width * 40;

    ship = new Image(width, heigh)

    return ship
}