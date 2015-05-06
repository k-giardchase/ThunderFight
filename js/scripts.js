// GLOBALS
var PLAYGROUND_HEIGHT = 250;
var PLAYGROUND_WIDTH = 700;





// jQuery
$(document).ready(function() {

$("#playground").playground({ height: PLAYGROUND_HEIGHT, width: PLAYGROUND_WIDTH })
    .addGroup("background", { width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT }).end()
    .addGroup("actors", { width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT }).end()
    .addGroup("playerMissileLayer", { width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT}).end()
    .addGroup("enemiesMissileLayer", { width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT });


});
