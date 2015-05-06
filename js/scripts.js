// Global constants:
var PLAYGROUND_WIDTH     = 700;
var PLAYGROUND_HEIGHT    = 250;
var REFRESH_RATE         = 30;

//Constants for the gameplay
var smallStarSpeed        = 1; //pixels per frame

var mediumStarSpeed       = 3; //pixels per frame

var bigStarSpeed          = 5; //pixels per frame

//Gloabl animation holder
var playerAnimation = new Array();
var missile = new Array();
var enemies = new Array(3);

// jQuery
$(function(){

    // Initialize the game:
    $("#playground").playground({ height: PLAYGROUND_HEIGHT, width: PLAYGROUND_WIDTH });

    // Animations declaration (background)
    var background1 = new $.gQ.Animation({
        imageURL: "http://gamequeryjs.com/demos/3/background1.png"});
    var background2 = new $.gQ.Animation({
        imageURL: "http://gamequeryjs.com/demos/3/background2.png"});
    var background3 = new $.gQ.Animation({
        imageURL: "http://gamequeryjs.com/demos/3/background3.png"});
    var background4 = new $.gQ.Animation({
        imageURL: "http://gamequeryjs.com/demos/3/background4.png"});
    var background5 = new $.gQ.Animation({
        imageURL: "http://gamequeryjs.com/demos/3/background5.png"});
    var background6 = new $.gQ.Animation({
        imageURL: "http://gamequeryjs.com/demos/3/background6.png"});


    // Initialize the background
    $.playground()
        .addGroup("background", { width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT })
        .addSprite("background1", { animation: background1, width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT })
        .addSprite("background2", { animation: background2, width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT, posx: PLAYGROUND_WIDTH })
        .addSprite("background3", { animation: background3, width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT })
        .addSprite("background4", { animation: background4, width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT, posx: PLAYGROUND_WIDTH })
        .addSprite("background5", { animation: background5, width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT })
        .addSprite("background6", { animation: background6, width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT, posx: PLAYGROUND_WIDTH })


    //initialize the start button
    $("#startbutton").click(function() {
        $.playground().startGame(function() {
            $("#welcomeScreen").remove();
        });
    });


    //This is for the background animation
    $.playground().registerCallback(function(){

        var newPos = ($("#background1").x() - smallStarSpeed - PLAYGROUND_WIDTH) % (-2 * PLAYGROUND_WIDTH) + PLAYGROUND_WIDTH;
        $("#background1").x(newPos);

        newPos = ($("#background2").x() - smallStarSpeed - PLAYGROUND_WIDTH) % (-2 * PLAYGROUND_WIDTH) + PLAYGROUND_WIDTH;
        $("#background2").x(newPos);

        newPos = ($("#background3").x() - mediumStarSpeed - PLAYGROUND_WIDTH) % (-2 * PLAYGROUND_WIDTH) + PLAYGROUND_WIDTH;
        $("#background3").x(newPos);

        newPos = ($("#background4").x() - mediumStarSpeed - PLAYGROUND_WIDTH) % (-2 * PLAYGROUND_WIDTH) + PLAYGROUND_WIDTH;
        $("#background4").x(newPos);

        newPos = ($("#background5").x() - bigStarSpeed - PLAYGROUND_WIDTH) % (-2 * PLAYGROUND_WIDTH) + PLAYGROUND_WIDTH;
        $("#background5").x(newPos);

        newPos = ($("#background6").x() - bigStarSpeed - PLAYGROUND_WIDTH) % (-2 * PLAYGROUND_WIDTH) + PLAYGROUND_WIDTH;
        $("#background6").x(newPos);
    }, REFRESH_RATE);


    playerAnimation["idle"] = new $.gQ.Animation({ imageURL: "./img/player_spaceship.png" })
    playerAnimation["explode"] = new $.gQ.Animation({ imageURL: "./img/player_explode.png" })
    playerAnimation["up"] = new $.gQ.Animation({ imageURL: "./img/boosterup.png",
        numberOfFrame: 6, delta: 14, rate: 60,
        type: $.gameQuery.ANIMATION_HORIZONTAL});
    playerAnimation["down"] = new $.gQ.Animation({ imageURL: "./img/boosterdown.png",
        numberOfFrame: 6, delta: 14, rate: 60,
        type: $.gameQuery.ANIMATION_HORIZONTAL});
    playerAnimation["boost"] = new $.gQ.Animation({ imageURL: "./img/booster1.png",
        numberOfFrame: 6, delta: 14, rate: 60,
        type: $.gameQuery.ANIMATION_VERTICAL});
    playerAnimation["booster"] = new $.gQ.Animation({ imageURL: "./img/booster2.png"});

    //Initalize the background
    $.playground().addGroup("actors", {width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT })
        .addGroup("player", { posx: PLAYGROUND_WIDTH/2, posy: PLAYGROUND_HEIGHT/2,
            width: 100, height: 26 })
        .addSprite("playerBoostUp", {posx: 37, posy: 15,
            width: 14, height: 18})
        .addSprite("playerBody", { animation: playerAnimation["idle"],
            posx: 0, posy: 0, width: 100, height: 26})
        .addSprite("playerBooster", { animation: playerAnimation["boost"],
            posx: -32, posy: 5, width: 36, height: 14})
        .addSprite("playerBoostDown", { posx: 37, posy: -7,
            width: 14, height: 18 });

 $(document).keydown(function(e){
    //  if(!gameOver && !playerHit){
     switch(e.keyCode){
         case 75://this is shoot(k)
                 //shoot missile here
                 var playerposx = ("#player").x();
                 var playerposy = ("#player").y();
                 missileCounter =(missileCounter + 1) % 100000;
                 var name = "playerMissile_" +missileCounter;
                 $("#playerMissileLayer").addSprite(name,{animation: missile["player"], posx: playerposx + 90,
                  posy: playerposy + 14, width: 36,height: 10});
                  $("#"+name).addClass("playerMissiles")
                  break;
         case 65: //this is lift! (a)
         $("#playerBooster").setAnimation();
         break;
         case 87: //this is up!(w)
         $("#playerBoostUp").setAnimation(playerAnimation["up"]);
         break;
         case 68: //this is right!(d)
         $("#playerBooster").setAnimation(playerAnimation["booster"]);
         break;
         case 83: //this is down!(s)
         $("#playerBoostDown").setAnimation(playerAnimation["down"]);
         break;

    //  }
   }
 });
     $(document).keyup(function(e){
        //  if(!gameOver && !playerHit){
         switch(e.keyCode){
             case 65: //this is left!(a)
             $("#playerBooster").setAnimation(playerAnimation["boost"]);
             break;
             case 87: //this is up!(w)
             $("#playerBoostUp").setAnimation();
             break;
             case 68: //this is right!(d)
             $("#playerBooster").setAnimation(playerAnimation["boost"]);
             break;
             case 83: //this is down!(s)
             $("#playerBoostDown").setAnimation();
             break;
        //  }
        }
     });


});  // CLOSING jQuery
