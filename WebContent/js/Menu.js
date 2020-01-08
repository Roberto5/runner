
runner.Menu.prototype = {
		init:function(){
			controllOrientation(Phaser.Scale.LANDSCAPE);
			game.scale.on('orientationchange', function() {
				controllOrientation(Phaser.Scale.LANDSCAPE);
			}
			,this);
		},
    preload : function() {
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
        },this);
    	this.menu=this.add.sprite(this.game.width / 2,this.game.height / 2,'menu');
    	this.menu.setScale(0.6);
    	this.menu.setInteractive();
    	this.menu.over=[false,false,false];
    	this.shadow=[];
        shadowname=['gecko','gatto','gufetta'];
    	
    	//this.menu.on('pointerdown',function(obj,x,y){
			//@todo play sound
        //},this);
		this.menu.on('pointermove',function(obj,x,y){
			// over gecko
			if ((x>0)&&(x<300)) this.menu.over=[true,false,false];
			// over gattoboy
			if ((x>300)&&(x<600)) this.menu.over=[false,true,false];
			// over gufetta
			if (x>600) this.menu.over=[false,false,true];
			
        },this);
        this.menu.on('pointerout',function(obj){
        	this.menu.over=[false,false,false];
        },this);
        this.menu.on('pointerup',function(obj,x,y){
        	// over gecko
        	// over gattoboy
			if ((x>300)&&(x<600)) {
				this.game.scene.start('Gatto');
				this.game.scene.stop('Menu');
			}
			// over gufetta
        },this);
		
        for (var i=0;i<3;i++) {
        	this.shadow[i]=this.add.sprite(this.game.width / 2,this.game.height / 2,shadowname[i]+"shadow");
    		this.shadow[i].setScale(0.6);
    		this.alpha=0;
        }
    },
    update: function() {
    	//hover effect
    	for (var i=0;i<this.menu.over.length;i++)
    	{
    		if (this.menu.over[i]) {
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