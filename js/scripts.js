// GLOBALS
var PLAYGROUND_WIDTH   = 700;
var PLAYGROUND_HEIGHT  = 250;
var REFRESH_RATE       = 15;
var GRACE              = 2000;
var MISSILE_SPEED      = 10;

// BG CONSTANTS
var smallStarSpeed     = 1; //pixels per frame
var mediumStarSpeed    = 3; //pixels per frame
var bigStarSpeed       = 4; //pixels per frame

// GAME CONSTANTS
var playerAnimation = new Array();
var missile         = new Array();
var enemies         = new Array(3);

// GAME STATE CONSTANTS
var bossMode = false;
var bossName = null;
var playerHit = false;
var timeOfRespawn = 0;
var gameOver = false;
var missileCounter = 0;


function restartgame() {
    window.location.reload();
};

function explodePlayer(playerNode) {
    playerNode.children().hide();
    playerNode.addSprite('explosion', { animation: playerAnimation['explode'], width: 100, height: 26 });
    playerHit = true;
};


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
};

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
          $(this.node).fadeTo(500, 1);
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
        if (this.shield == 0) {
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
    Minion.prototype = new Enemy();

    Minion.prototype.updateY = function(playerNode) {
        // var pos = parseInt(this.node.css('top'));
        if(this.node.y() > (PLAYGROUND_HEIGHT - 100)) {
            this.node.y(-2, true);
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
        if((this.node.y() + this.alignmentOffset) > $(playerNode).y()) {
            this.node.y(-this.speedy, true);
        } else if((this.node.y() + this.alignmentOffset) < $(playerNode).y()) {
            this.node.y(this.speedy, true);
        }
}


function Bossy(node) {
    this.node = $(node);
    this.shield = 50;
    this.speedx = -1;
    this.alignmenetOffset = 35;
}
Bossy.prototype = new Brainy();
Bossy.prototype.updateX = function() {
    if(this.node.x() > (PLAYGROUND_WIDTH - 200)) {
        this.node.x(this.speedx, true);
    }
}


// jQuery
$(function() {

  // Animations Declaration (BG)
  var background1 = new $.gQ.Animation({ imageURL: "img/background1.png"});
  var background2 = new $.gQ.Animation({ imageURL: "img/background2.png"});
  var background3 = new $.gQ.Animation({ imageURL: "img/background3.png"});
  var background4 = new $.gQ.Animation({ imageURL: "img/background4.png"});
  var background5 = new $.gQ.Animation({ imageURL: "img/background5.png"});
  var background6 = new $.gQ.Animation({ imageURL: "img/background6.png"});

  // Define Player Animations
  playerAnimation["idle"]    = new $.gQ.Animation({ imageURL: "img/player_spaceship.png" })
  playerAnimation["explode"] = new $.gQ.Animation({ imageURL: "img/player_explode.png", numberOfFrame: 4, delta: 26, rate: 60, type: $.gQ.ANIMATION_VERTICAL });
  playerAnimation["up"]      = new $.gQ.Animation({ imageURL: "img/boosterup.png", numberOfFrame: 6, delta: 14, rate: 60, type: $.gQ.ANIMATION_HORIZONTAL });
  playerAnimation["down"]    = new $.gQ.Animation({ imageURL: "img/boosterdown.png", numberOfFrame: 6, delta: 14, rate: 60, type: $.gQ.ANIMATION_HORIZONTAL });
  playerAnimation["boost"]   = new $.gQ.Animation({ imageURL: "img/booster1.png", numberOfFrame: 6, delta: 14, rate: 60, type: $.gQ.ANIMATION_VERTICAL });
  playerAnimation["booster"] = new $.gQ.Animation({ imageURL: "img/booster2.png", numberOfFrame: 6, delta: 14, rate: 60, type: $.gQ.ANIMATION_VERTICAL });

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

  // Initialize the Game:
  $("#playground").playground({ height: PLAYGROUND_HEIGHT, width: PLAYGROUND_WIDTH, keyTracker: true });

  // Initialize the Playground
  $.playground()
    .addGroup("background", { width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT })
      .addSprite("background1", { animation: background1, width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT })
      .addSprite("background2", { animation: background2, width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT, posx: PLAYGROUND_WIDTH })
      .addSprite("background3", { animation: background3, width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT })
      .addSprite("background4", { animation: background4, width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT, posx: PLAYGROUND_WIDTH })
      .addSprite("background5", { animation: background5, width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT })
      .addSprite("background6", { animation: background6, width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT, posx: PLAYGROUND_WIDTH })
    .end()
    .addGroup("actors", {width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT })
      .addGroup("player", { posx: PLAYGROUND_WIDTH/2, posy: PLAYGROUND_HEIGHT/2, width: 100, height: 26 })
        .addSprite("playerBoostUp", { posx: 37, posy: 15, width: 14, height: 18 })
        .addSprite("playerBody", { animation: playerAnimation["idle"], posx: 0, posy: 0, width: 100, height: 26})
        .addSprite("playerBooster", { animation: playerAnimation["boost"], posx: -32, posy: 5, width: 36, height: 14})
        .addSprite("playerBoostDown", { posx: 37, posy: -7, width: 14, height: 18 })
        .end()
    .end()
    .addGroup("playerMissileLayer",{width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT}).end()
    .addGroup("enemiesMissileLayer",{width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT}).end()
    .addGroup("overlay",{width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT});

    $("#player")[0].player = new Player($("#player"));

    $("#overlay").append("<div id='shieldHUD' style='color: white; width: 100px; position: absolute; font-family: verdana, sans-serif;'></div>");
    $("#overlay").append("<div id='lifeHUD' style='color: white; top: 20px; width: 100px; position: absolute; font-family: verdana, sans-serif;'></div>");

    // $.loadCallback(function(percent) {
    //     $("#loadingBar").width(400 * percent);
    // });


  $(document).one('keypress', function(e) {
      if (e.keyCode == 13) {
          $.playground().startGame(function() {
            $("#welcomeScreen").fadeTo(1000, 0, function() { $(this).remove(); });
          });
      }
  });


  // $("#startbutton").click(function() {
  //   $.playground().startGame(function() {
  //     $("#welcomeScreen").fadeTo(1000, 0, function() { $(this).remove(); });
  //   });
  // });


    $.playground().registerCallback(function() {
        if(!gameOver) {
            $("#shieldHUD").html("shield: " + $("#player")[0].player.shield);
            $("#lifeHUD").html("life: " + $("#player")[0].player.replay);
            //Update the movement of the ship:
            if(!playerHit) {
                $('#player')[0].player.update();
                if(jQuery.gQ.keyTracker[65] || jQuery.gQ.keyTracker[37]) { // this is left! (a)
                    var nextpos = $('#player').x() - 5;
                    if (nextpos > 0) {
                        $('#player').x(nextpos);
                    }
                }
                if (jQuery.gQ.keyTracker[68] || jQuery.gQ.keyTracker[39]) { // this is right! (d)
                    var nextpos = $('#player').x() + 5;
                    if(nextpos < PLAYGROUND_WIDTH - 100) {
                        $('#player').x(nextpos);
                    }
                }
                if (jQuery.gQ.keyTracker[87] || jQuery.gQ.keyTracker[38]) { // this is up! (w)
                    var nextpos = $('#player').y() - 3;
                    if(nextpos > 0) {
                        $('#player').y(nextpos);
                    }
                }
                if (jQuery.gQ.keyTracker[83] || jQuery.gQ.keyTracker[40]) { // this is down! (s)
                    var nextpos = $('#player').y() + 3;
                    if (nextpos < PLAYGROUND_HEIGHT - 30) {
                        $('#player').y(nextpos);
                    }
                }
            }
            else {
                var posy = $('#player').y() + 5;
                var posx = $('#player').x() - 5;
                if (posy > PLAYGROUND_HEIGHT) {
                    if ($('#player')[0].player.respawn()) {
                        gameOver = true;
                        $('#playground').append('<div style="position: absolute; top: 30px; width: 700px; color: white; font-family: Starjhol;"><center><h2>Game over</h2><br><a style="cursor: pointer;" id="restartbutton">Press ENTER to restart the game!</a></center></div>');
                        $(document).one('keypress', function(e) {
                            if (e.keyCode == 13) {
                                restartgame();
                            }
                        });
                        $("#actors, #playerMissileLayer, #enemiesMissileLayer").fadeTo(1000, 0);
                        $("#background").fadeTo(5000, 0);
                    } else {
                        $("#explosion").remove();
                        $("#player").children().show();
                        $("#player").y(PLAYGROUND_HEIGHT / 2);
                        $("#player").x(PLAYGROUND_WIDTH / 2);
                        playerHit = false;
                    }
                } else {
                    $("#player").y(posy);
                    $("#player").x(posx);
                }
            }

            $(".enemy").each(function() {
                this.enemy.update($("#player"));
                var posx = $(this).x();
                if((posx + 100) < 0) {
                    $(this).remove();
                    return;
                }

                //Test for collisions
                var collided = $(this).collision("#playerBody,."+$.gQ.groupCssClass);
                if(collided.length > 0) {
                    if(this.enemy instanceof Bossy) {
                        $(this).setAnimation(enemies[2]["explode"], function(node){$(node).remove();});
                        $(this).css("width", 150);
                    } else if(this.enemy instanceof Brainy) {
                        $(this).setAnimation(enemies[1]["explode"], function(node){$(node).remove();});
                        $(this).css("width", 150);
                    } else {
                        $(this).setAnimation(enemies[0]["explode"], function(node){$(node).remove();});
                        $(this).css("width", 200);
                    }
                    $(this).removeClass("enemy");

                    //The player has been hit!
                    if ($("#player")[0].player.damage()) {
                        explodePlayer($("#player"));
                    }
                }

                // Make the enemy fire
                if (this.enemy instanceof Brainy) {
                    if (Math.random() < 0.05) {
                        var enemyposx = $(this).x();
                        var enemyposy = $(this).y();
                        missileCounter = (missileCounter + 1) % 100000;
                        var name = "enemiesMissile_" + missileCounter;
                        $("#enemiesMissileLayer").addSprite(name, { animation: missile["enemies"], posx: enemyposx, posy: enemyposy + 20, width: 30, height: 15 });
                        $("#" + name).addClass("enemiesMissiles");
                    }
                }
            });

            $(".playerMissiles").each(function() {
                var posx = $(this).x();
                if (posx > PLAYGROUND_WIDTH) {
                    $(this).remove();
                    return;
                }
                $(this).x(MISSILE_SPEED, true);

                var collided = $(this).collision(".enemy,." + $.gQ.groupCssClass);
                if (collided.length > 0) {
                    collided.each(function() {
                        if ($(this)[0].enemy.damage()) {
                            if (this.enemy instanceof Bossy) {
                                $(this).setAnimation(enemies[2]["explode"], function(node) { $(node).remove(); });
                                $(this).css("width", 150);
                            } else if (this.enemy instanceof Brainy) {
                                $(this).setAnimation(enemies[1]["explode"], function(node) { $(node).remove(); });
                                $(this).css("width", 150);
                            } else {
                                $(this).setAnimation(enemies[0]["explode"], function(node) { $(node).remove(); });
                                $(this).css("width", 150);
                            }
                            $(this).removeClass("enemy");
                        }
                    });
                    $(this).setAnimation(missile["playerexplode"], function(node) { $(node).remove(); });
                    $(this).css("width", 38);
                    $(this).css("height", 23);
                    $(this).y(-7, true);
                    $(this).removeClass("playerMissiles");

                }

            });

            $(".enemiesMissiles").each(function() {
                var posx = $(this).x();
                if (posx < 0) {
                    $(this).remove();
                    return;
                }
                $(this).x(-MISSILE_SPEED, true);
                var collided = $(this).collision("#playerBody,." + $.gQ.groupCssClass);
                if (collided.length > 0) {
                    collided.each(function() {
                        if ($("#player")[0].player.damage()) {
                            explodePlayer($("#player"));
                        }
                    })
                    $(this).setAnimation(missile["enemiesexplode"], function(node) { $(node).remove(); });
                    $(this).removeClass("enemiesMissiles");
                }
            });

        }
    }, REFRESH_RATE);


  // This function manages the creation of the enemies
  $.playground().registerCallback(function() {
      if (!bossMode && !gameOver) {

          if (Math.random() < 0.4) {
              var name = "enemy1_" + Math.ceil(Math.random() * 1000);
              $("#actors").addSprite(name, { animation: enemies[0]["idle"],
                posx: PLAYGROUND_WIDTH, posy: Math.random() * PLAYGROUND_HEIGHT,
                width: 150, height: 52 });
              $("#" + name).addClass("enemy");
              $("#" + name)[0].enemy = new Minion($("#" + name));
          }
          else if (Math.random() > 0.5) {
              var name = "enemy1_" + Math.ceil(Math.random() * 1000);
              $("#actors").addSprite(name, { animation: enemies[1]["idle"],
                posx: PLAYGROUND_WIDTH, posy: Math.random() * PLAYGROUND_HEIGHT,
                width: 100, height: 42 });
              $("#" + name).addClass("enemy");
              $("#" + name)[0].enemy = new Brainy($("#" + name));
          }
          else if (Math.random() > 0.8) {
              bossMode = true;
              bossName = "enemy1_" + Math.ceil(Math.random() * 1000);
              $("#actors").addSprite(bossName, { animation: enemies[2]["idle"],
                posx: PLAYGROUND_WIDTH, posy: Math.random() * PLAYGROUND_HEIGHT,
                width: 100, height: 100 });
              $("#" + bossName).addClass("enemy");
              $("#" + bossName)[0].enemy = new Bossy($("#" + bossName));
          }

      }
      else {
          if ($("#" + bossName).length == 0) {
              bossMode = false;
          }
      }
  }, 1000);

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


  // Animation Keymap
  $(document).keydown(function(e) {
    if(!gameOver && !playerHit) {
        switch(e.keyCode) {
          case 75:
            var playerposx = $("#player").x();
            var playerposy = $("#player").y();
            missileCounter = (missileCounter + 1) % 100000;
            var name = "playerMissile_" + missileCounter;
            $("#playerMissileLayer").addSprite(name, { animation: missile["player"], posx: playerposx + 90, posy: playerposy + 14, width: 36, height: 10 });
            $("#" + name).addClass("playerMissiles");
            break;
          case 65: //this is left! (a)
            $("#playerBooster").setAnimation();
            break;
          case 37:
            $("#playerBooster").setAnimation();
            break;
          case 87: //this is up!(w)
            $("#playerBoostUp").setAnimation(playerAnimation["up"]);
            break;
          case 38:
            $("#playerBoostUp").setAnimation(playerAnimation["up"]);
            break;
          case 68: //this is right!(d)
            $("#playerBooster").setAnimation(playerAnimation["booster"]);
            break;
          case 39:
            $("#playerBooster").setAnimation(playerAnimation["booster"]);
            break;
          case 83: //this is down!(s)
            $("#playerBoostDown").setAnimation(playerAnimation["down"]);
            break;
          case 40:
            $("#playerBoostDown").setAnimation(playerAnimation["down"]);
            break;

        }
    }
  });

  // Animation Keymap (opposite)
  $(document).keyup(function(e) {
    if(!gameOver && !playerHit) {
        switch(e.keyCode) {
          case 65: //this is left!(a)
            $("#playerBooster").setAnimation(playerAnimation["boost"]);
            break;
          case 37:
            $("#playerBooster").setAnimation(playerAnimation["boost"]);
            break;
          case 87: //this is up!(w)
            $("#playerBoostUp").setAnimation();
            break;
          case 38:
            $("#playerBoostUp").setAnimation();
            break;
          case 68: //this is right!(d)
            $("#playerBooster").setAnimation(playerAnimation["boost"]);
            break;
          case 39:
            $("#playerBooster").setAnimation(playerAnimation["boost"]);
            break;
          case 83: //this is down!(s)
            $("#playerBoostDown").setAnimation();
            break;
          case 40:
            $("#playerBoostDown").setAnimation();
            break;
        }
    }
  });

});  // CLOSING jQuery
