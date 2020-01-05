
runner.Menu.prototype = {
	isFullScreen:false,
    preload : function() {
    },
    fullscreen : function () {
    	if (!this.isFullScreen) {
    		this.game.canvas[this.game.device.fullscreen.request]();
    		//this.isFullScreen=true;
    	}
    	
    },
    create: function(){
    	this.add.sprite(20,20,'fullscreen').setInteractive().on('pointerdown',function(obj){
    		if (this.game.scale.isFullscreen) {
    	        this.game.scale.stopFullscreen();
    	        // On stop fulll screen
    	    } else {
    	    	this.game.scale.startFullscreen();
    	        // On start fulll screen
    	    }
    			//this.fullscreen();
        },this);
    	this.menu=[];
    	this.shadow=[];
        shadowname=['gecko','gatto','gufetta'];
    	for (var i=0;i<3;i++) {
    		this.menu[i]=this.add.sprite(0,0,shadowname[i]+'menu');
        	this.menu[i].x = this.game.width / 2;
    		this.menu[i].y = this.game.height / 2;
    		this.menu[i].setScale(0.6);
    		this.menu[i].setInteractive(this.input.makePixelPerfect());
    		this.menu[i].inputEnabled = true;
            this.menu[i].over=false;
    	}
    	this.menu[0].on('pointerdown',function(obj){
			//@todo play sound
        },this);
		this.menu[0].on('pointerover',function(obj){
			this.menu[0].over=true;
        },this);
        this.menu[0].on('pointerout',function(obj){
        	this.menu[0].over=false;
        },this);
        this.menu[1].on('pointerup',function(obj){
        	this.game.scene.start('Gatto');
        	this.game.scene.stop('Menu');
        },this);
		this.menu[1].on('pointerover',function(obj){
			this.menu[1].over=true;
        },this);
        this.menu[1].on('pointerout',function(obj){
        	this.menu[1].over=false;
        },this);
		this.menu[2].on('pointerover',function(obj){
			this.menu[2].over=true;
        },this);
        this.menu[2].on('pointerout',function(obj){
        	this.menu[2].over=false;
        },this);
        for (var i=0;i<3;i++) {
        	this.shadow[i]=this.add.sprite(0,0,shadowname[i]+"shadow");
        	this.shadow[i].x = this.game.width / 2;
    		this.shadow[i].y = this.game.height / 2;
    		this.shadow[i].setScale(0.6);
    		this.alpha=0;
        }
        // @todo this.tap unuse, mabie in the future will be use?
        /*this.input.on('pointerdown',function(v){this.tap=true;},this);
        this.input.on('pointerdown',function(v){this.tap=false;},this);*/
    },
    update: function() {
    	//hover effect
    	for (var i=0;i<this.menu.length;i++)
    	{
    		if (this.menu[i].over) {
        		this.shadow[i].alpha=1;
        	}
        	else {
        		this.shadow[i].alpha=0;
        	}
    	}
    	
    	
        
    },
   /* resumed : function() {
    	
        this.game.state.restart();
    }*/
};
function how(obj) {
	this.tap=false;
	this.game.scene.start('How');
	this.game.scene.stop('Menu');
}
function play(obj) {
	this.tap=false;
	this.game.scene.start('Game');
	this.game.scene.stop('Menu');
}