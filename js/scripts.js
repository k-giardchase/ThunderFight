// GLOBALS
var PLAYGROUND_HEIGHT = 250;
var PLAYGROUND_WIDTH  = 700;
var REFRESH_RATE      = 30;

// Constants for gameplay
var smallStarSpeed    = 1;
var mediumStarSpeed   = 3;
var bigStarSpeed      = 5;


// jQuery
$(document).ready(function() {

$("#playground").playground({ height: PLAYGROUND_HEIGHT, width: PLAYGROUND_WIDTH })
    .addGroup("background", { width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT }).end()
    .addGroup("actors", { width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT }).end()
    .addGroup("playerMissileLayer", { width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT}).end()
    .addGroup("enemiesMissileLayer", { width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT });

var background1 = new $.gameQuery.Animation({imageURL: "img/background1.png"});
var background2 = new $.gameQuery.Animation({imageURL: "img/background2.png"});
var background3 = new $.gameQuery.Animation({imageURL: "img/background3.png"});
var background4 = new $.gameQuery.Animation({imageURL: "img/background4.png"});
var background5 = new $.gameQuery.Animation({imageURL: "img/background5.png"});
var background6 = new $.gameQuery.Animation({imageURL: "img/background6.png"});

    $("#background")
        .addSprite("background1", {animation: background1,
            width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT})
        .addSprite("background2", {animation: background2,
            width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT,
            posx: PLAYGROUND_WIDTH})
        .addSprite("background3", {animation: background3,
            width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT})
        .addSprite("background4", {animation: background4,
            width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT,
            posx: PLAYGROUND_WIDTH})
        .addSprite("background5", {animation: background5,
            width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT})
        .addSprite("background6", {animation: background6,
            width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT,
            posx: PLAYGROUND_WIDTH});

    $("#welcomeScreen").click(function() {
        $.playground().startGame(function() {
            $("#welcomeScreen").remove();
        });
    })

    $.playground().registerCallback(function(){
         //offset all the pane:
         var newPos = (parseInt($("#background1").css("left")) - smallStarSpeed - PLAYGROUND_WIDTH)
         %(-2 * PLAYGROUND_WIDTH) + PLAYGROUND_WIDTH;
         $("#background").css("left", newPos);

         newPos = (parseInt($("#background2").css("left")) - smallStarSpeed - PLAYGROUND_WIDTH)
         %(-2 * PLAYGROUND_WIDTH) + PLAYGROUND_WIDTH;
         $("#background").css("left", newPos);

         newPos = (parseInt($("#background3").css("left")) - mediumStarSpeed - PLAYGROUND_WIDTH)
         %(-2 * PLAYGROUND_WIDTH) + PLAYGROUND_WIDTH;
         $("#background").css("left", newPos);

         newPos = (parseInt($("#background4").css("left")) - mediumStarSpeed - PLAYGROUND_WIDTH)
         %(-2 * PLAYGROUND_WIDTH) + PLAYGROUND_WIDTH;
         $("#background").css("left", newPos);

         newPos = (parseInt($("#background5").css("left")) - bigStarSpeed - PLAYGROUND_WIDTH)
         %(-2 * PLAYGROUND_WIDTH) + PLAYGROUND_WIDTH;
         $("#background").css("left", newPos);

         newPos = (parseInt($("#background6").css("left")) - bigStarSpeed - PLAYGROUND_WIDTH)
         %(-2 * PLAYGROUND_WIDTH) + PLAYGROUND_WIDTH;
         $("#background").css("left", newPos);

     }, REFRESH_RATE);







     })
