// GLOBALS
var PLAYGROUND_WIDTH   = 700;
var PLAYGROUND_HEIGHT  = 250;
var REFRESH_RATE       = 30;

//BG CONSTANTS
var smallStarSpeed     = 1; //pixels per frame
var mediumStarSpeed    = 3; //pixels per frame
var bigStarSpeed       = 5; //pixels per frame

//GAME CONSTANTS
var playerAnimation = new Array();
var missile         = new Array();
var enemies         = new Array(3);


// PLAYER OBJECT
function Player(node) {
  this.node = node;

  //this.animations = animations;
  this.grace = false;
  this.replay = 3;
  this.shield = 3;
  this.respawnTime = -1;

  this.damage = function() {
    if(!this.grace) {
      this.shield--;
      if (this.shield == 0) {
        return true;
      }
      return false;
    }
    return false;
  }

  // respawns the ship after death and returns true if the game is over
  this.respawn = function() {
      this.replay--;
      if (this.replay == 0) {
          return true;
      }

      this.grace = true;
      this.shield = 3;

      this.respawnTime = (new Date()).getTime();
      $(this.node).fadeTo(0, 0.5);
      return false;
  };

  this.update = function() {
      if ((this.respawnTime > 0) && (((new Date()).getTime()-this.respawnTime) > 3000)) {
          this.grace = false;
          $(this.node).fadeTo(0, 1);
          this.respawnTime = -1;
      }
  }

  return true;
};

function Enemy(node) {
    this.shield = 2;
    this.speedx = -5;
    this.speedy = 0;
    this.node = $(node);

    //deals with damage endured by an enemy
    this.damage = function() {
        this.shield--;
        if(this.shield == 0) {
            return true;
        }
        return false;
    };

    //updates the position of the enemy
    this.update = function(playerNode) {
        this.updateX(playerNode);
        this.updateY(playerNode);
    };

    this.updateX = function(playerNode) {
        this.node.x(this.speedx, true);
    };

    this.updateY = function(playerNode) {
        var newpos = parseInt(this.node.css("top")) + this.speedy;
        this.node.y(this.speedy, true);
    };
}


function Minion(node) {
        this.node = $(node);
    }
    Minion,prototype = new Enemy();

    Minion.prototype.updateY = function(playerNode) {
        var pos = parseInt(this.node.css('top'));
        if(pos > (PLAYGROUND_HEIGHT - 50)) {
            this.node.css('top', ''+(pos - 2)+'px');
        }
    }

function Brainy(node) {
        this.node = $(node);
        this.shield = 5;
        this.speedy = 1;
        this.alignmentOffset = 5;
    }
    Brainy.prototype = new Enemy();
    Brainy.prototype.updateY = function(playerNode) {
        if((this.node[0].gameQuery.posy+this.alignmentOffset) > $(playerNode)[0].gameQuery.posy) {
            var newpos = parseInt(this.node.css('top'))-this.speedy;
            this.node.css('top', ''+newpos+'px');
        } else if((this.node[0].gameQuery.posy+this.alignmentOffset) < $(playNode)[0].gameQuery.posy) {
            var newpos = parseInt(this.node.css('top'))+this.speedy;
            this.node.css('top', ''+newpos+'px');
        }
}


function Bossy(node) {
    this.node = $(node);
    this.shield = 20;
    this.speedx = -1;
    this.alignmenetOffset = 35;
}
Bossy.prototype = new Brainy();
Bossy.prototype.updateX = function() {
    var pos = parseInt(this.node.css('left'));
    if(pos > (PLAYGROUND_WIDTH -200)) {
        this.node.css('left', ''+(pos+this.speedx)+'px');
    }
}





// jQuery
$(function() {

  // Initialize the Game:
  $("#playground").playground({ height: PLAYGROUND_HEIGHT, width: PLAYGROUND_WIDTH });

  // Animations Declaration (BG)
  var background1 = new $.gQ.Animation({ imageURL: "img/background1.png"});
  var background2 = new $.gQ.Animation({ imageURL: "img/background2.png"});
  var background3 = new $.gQ.Animation({ imageURL: "img/background3.png"});
  var background4 = new $.gQ.Animation({ imageURL: "img/background4.png"});
  var background5 = new $.gQ.Animation({ imageURL: "img/background5.png"});
  var background6 = new $.gQ.Animation({ imageURL: "img/background6.png"});

  // Initialize the Playground
  $.playground()
    .addGroup("background", { width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT })
      .addSprite("background1", { animation: background1, width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT })
      .addSprite("background2", { animation: background2, width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT, posx: PLAYGROUND_WIDTH })
      .addSprite("background3", { animation: background3, width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT })
      .addSprite("background4", { animation: background4, width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT, posx: PLAYGROUND_WIDTH })
      .addSprite("background5", { animation: background5, width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT })
      .addSprite("background6", { animation: background6, width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT, posx: PLAYGROUND_WIDTH })

  // Initialize the Start Button
  $("#startbutton").click(function() {
    $.playground().startGame(function() {
      $("#welcomeScreen").remove();
    });
  });

  //This is for the background animation
  $.playground().registerCallback(function() {

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

  // Define Player Animations
  playerAnimation["idle"]    = new $.gQ.Animation({ imageURL: "img/player_spaceship.png" })
  playerAnimation["explode"] = new $.gQ.Animation({ imageURL: "img/player_explode.png" })
  playerAnimation["up"]      = new $.gQ.Animation({ imageURL: "img/boosterup.png", numberOfFrame: 6, delta: 14, rate: 60, type: $.gameQuery.ANIMATION_HORIZONTAL});
  playerAnimation["down"]    = new $.gQ.Animation({ imageURL: "img/boosterdown.png", numberOfFrame: 6, delta: 14, rate: 60, type: $.gameQuery.ANIMATION_HORIZONTAL});
  playerAnimation["boost"]   = new $.gQ.Animation({ imageURL: "img/booster1.png", numberOfFrame: 6, delta: 14, rate: 60, type: $.gameQuery.ANIMATION_VERTICAL});
  playerAnimation["booster"] = new $.gQ.Animation({ imageURL: "img/booster2.png"});

  //Initialize the Background
  $.playground().addGroup("actors", {width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT })
    .addGroup("player", { posx: PLAYGROUND_WIDTH/2, posy: PLAYGROUND_HEIGHT/2, width: 100, height: 26 })
      .addSprite("playerBoostUp", { posx: 37, posy: 15, width: 14, height: 18 })
      .addSprite("playerBody", { animation: playerAnimation["idle"], posx: 0, posy: 0, width: 100, height: 26})
      .addSprite("playerBooster", { animation: playerAnimation["boost"], posx: -32, posy: 5, width: 36, height: 14})
      .addSprite("playerBoostDown", { posx: 37, posy: -7, width: 14, height: 18 });

  // Animation Keymap
  $(document).keydown(function(e) {
    // if(!gameOver && !playerHit) {
    switch(e.keyCode) {
      case 75:
        var playerposx = ("#player").x();
        var playerposy = ("#player").y();
        missileCounter = (missileCounter + 1) % 100000;
        var name = "playerMissile_" + missileCounter;

        $("#playerMissileLayer").addSprite(name,{ animation: missile["player"], posx: playerposx + 90, posy: playerposy + 14, width: 36, height: 10 });
        $("#" + name).addClass("playerMissiles");
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
    }
    // }
  });

  // Animation Keymap (opposite)
  $(document).keyup(function(e) {
    // if(!gameOver && !playerHit) {
    switch(e.keyCode) {
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
    }
    // }
  });

  // 1st Enemy Type
  enemies[0] = new Array();
  enemies[0]["idle"] = new $.gQ.Animation({ imageURL: "img/minion_idle.png", numberOfFrame: 5, delta: 52, rate: 60, type: $.gameQuery.ANIMATION_VERTICAL });
  enemies[0]["explode"] = new $.gameQuery.Animation({ imageURL: "img/minion_explode.png", numberOfFrame: 11, delta: 52, rate: 30, type: $.gameQuery.ANIMATION_VERTICAL | $.gameQuery.ANIMATION_CALLBACK });

  // 2nd Enemy Type
  enemies[1] = new Array();
  enemies[1]["idle"] = new $.gQ.Animation({ imageURL: "img/brainy_idle.png", numberOfFrame: 8, delta: 42, rate: 60, type: $.gameQuery.ANIMATION_VERTICAL });
  enemies[1]["explode"] = new $.gameQuery.Animation({ imageURL: "img/brainy_explode.png", numberOfFrame: 8, delta: 42, rate: 60, type: $.gameQuery.ANIMATION_VERTICAL | $.gameQuery.ANIMATION_CALLBACK });

  // 3nd Enemy Type
  enemies[2] = new Array();
  enemies[2]["idle"] = new $.gQ.Animation({ imageURL: "img/bossy_idle.png", numberOfFrame: 5, delta: 100, rate: 60, type: $.gameQuery.ANIMATION_VERTICAL });
  enemies[2]["explode"] = new $.gameQuery.Animation({ imageURL: "img/bossy_explode.png", numberOfFrame: 5, delta: 100, rate: 60, type: $.gameQuery.ANIMATION_VERTICAL | $.gameQuery.ANIMATION_CALLBACK });

  // Missiles
  missile["player"] = new $.gameQuery.Animation({ imageURL: "img/player_missile.png", numberOfFrame: 6, delta: 10, rate: 90, type: $.gameQuery.ANIMATION_VERTICAL });
  missile["enemies"] = new $.gameQuery.Animation({ imageURL: "img/enemy_missile.png", numberOfFrame: 6, delta: 15, rate: 90, type: $.gameQuery.ANIMATION_VERTICAL });
  missile["playerexplode"] = new $.gameQuery.Animation({imageURL: "img/player_missile_explode.png", numberOfFrame: 8, delta: 23, rate: 90, type: $.gameQuery.ANIMATION_VERTICAL | $.gameQuery.ANIMATION_CALLBACK});
  missile["enemiesexplode"] = new $.gameQuery.Animation({imageURL: "img/player_missile_explode.png", numberOfFrame: 6, delta: 15, rate: 90, type: $.gameQuery.ANIMATION_VERTICAL | $.gameQuery.ANIMATION_CALLBACK});

});  // CLOSING jQuery
