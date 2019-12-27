var game;
var runner = {
		Boot:function(){},
		Preloader:function(){},
		Logo:function(){},
		Menu:function(){},
		Gatto:function(){}
};
//global game options
var gameOptions = {

    // platform speed range, in pixels per second
    platformSpeedRange: [300, 300],

    // mountain speed, in pixels per second
    mountainSpeed: 80,

    // spawn range, how far should be the rightmost platform from the right edge
    // before next platform spawns, in pixels
    spawnRange: [80, 300],

    // platform width range, in pixels
    platformSizeRange: [90, 300],

    // a height range between rightmost platform and next platform to be spawned
    platformHeightRange: [-5, 5],

    // a scale to be multiplied by platformHeightRange
    platformHeighScale: 20,

    // platform max and min height, as screen height ratio
    platformVerticalLimit: [0.4, 0.8],

    // player gravity
    playerGravity: 900,

    // player jump force
    jumpForce: 400,

    // player starting X position
    playerStartPosition: 200,

    // consecutive jumps allowed
    jumps: 2,

    // % of probability a coin appears on the platform
    coinPercent: 25,

    // % of probability a fire appears on the platform
    firePercent: 25
};

var language= {};
var lang;
ratio=16/9;
var gameConfig = {
        type: Phaser.AUTO,
        width: 1334,
        height: 750,
        backgroundColor: '#000',

        // physics settings
        physics: {
            'default': "arcade"
        }
    };
    game = new Phaser.Game(gameConfig);
    //add scene
    game.scene.add('Boot', runner.Boot);
    game.scene.add('Preloader', runner.Preloader);
    game.scene.add('Logo',runner.Logo);
    game.scene.add('Menu',runner.Menu);
    game.scene.add('Gatto', runner.Gatto);
    
    //resize windows
    window.focus();
    resize();
    window.addEventListener("resize", resize, false);
    
    game.scene.start('Boot');
    
    //back button handle
    window.addEventListener('load', function() {
    	  window.history.pushState({}, '');
    	});

    window.addEventListener('popstate', function() {

    	if (game.scene.isActive('Gatto')) {	
    		if (confirm(lang.returnMenu)) {
    			saveGame(game.data);
    			game.scene.stop('Gatto');
    			game.scene.start('Menu');
    		}
			
    	}
    	if (!game.scene.isActive('Menu')) window.history.pushState({}, '');
    });




function resize(){
    var canvas = document.querySelector("canvas");
    if (canvas==null) return;
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    var windowRatio = windowWidth / windowHeight;
    var gameRatio = game.config.width / game.config.height;
    if(windowRatio < gameRatio){
        canvas.style.width = windowWidth + "px";
        canvas.style.height = parseInt(windowWidth / gameRatio) + "px";
    }
    else{
        canvas.style.width = parseInt(windowHeight * gameRatio) + "px";
        canvas.style.height = windowHeight + "px";
    }
   
}