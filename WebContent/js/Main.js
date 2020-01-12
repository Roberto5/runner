var game;
var runner = {
		Boot:function(){},
		Preloader:function(){},
		Logo:function(){},
		Menu:function(){},
		Gatto:function(){}
};
//global game options
const gameOptions = {
	turboReq : 5,
	turboDuration:10,
	pointForCoin:1000,
    // platform speed range, in pixels per second
    platformSpeedRange: [300, 300],

    // mountain speed, in pixels per second
    mountainSpeed: 80,

    // spawn range, how far should be the rightmost platform from the right edge
    // before next platform spawns, in pixels
    spawnRange: [80, 250],

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
    coinPercent: 50,

    // % of probability a fire appears on the platform
    firePercent: 25
};

var language= {};
var lang;
ratio=16/9;
var gameConfig = {
        type: Phaser.AUTO,
        width: 900,
        height: 500,
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
    resize('firstBoot');
    window.addEventListener("resize", resize, false);
    game.scene.start('Boot');
    
    //back button handle
    window.addEventListener('load', function() {
    	  window.history.pushState({}, '');
    	});

    window.addEventListener('popstate', function() {

    	if (game.scene.isActive('Gatto')) {	
    		if (confirm(lang.returnMenu)) {
    			game.scene.stop('Gatto');
    			game.scene.start('Menu');
    		}
    	}
    	if (!game.scene.isActive('Menu')) window.history.pushState({}, '');
    });




function resize(first){
	if (first!='firstBoot') {
		//if (!game.scale.isFullscreen) {
			var canvas = document.querySelector("canvas");
		    if (canvas==null) return;
		    var windowWidth = window.innerWidth;
		    var windowHeight = window.innerHeight;
		    var windowRatio = windowWidth / windowHeight;
		    var gameRatio = game.config.width / game.config.height;
		    if(windowRatio < gameRatio){
		    	//game.scale.setGameSize(windowWidth,parseInt(windowWidth / gameRatio));
		        canvas.style.width = windowWidth+'px';
		        canvas.style.height = parseInt(windowWidth / gameRatio)+'px';
		    }
		    else{
		    	//game.scale.setGameSize( parseInt(windowHeight * gameRatio),windowHeight);
		    	canvas.style.width = parseInt(windowHeight * gameRatio)+'px';
		        canvas.style.height = windowHeight+'px';
		    }
		/*}
		else {
			canvas.style.width='';
			canvas.style.heigh='';
		}*/
	}
}
