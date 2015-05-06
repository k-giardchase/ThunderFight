// Global constants:
var PLAYGROUND_WIDTH     = 700;
var PLAYGROUND_HEIGHT    = 250;
var REFRESH_RATE         = 30;

//Constants for the gameplay
var smallStarSpeed        = 1; //pixels per frame

var mediumStarSpeed       = 3; //pixels per frame

var bigStarSpeed          = 5; //pixels per frame


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




});  // CLOSING jQuery
