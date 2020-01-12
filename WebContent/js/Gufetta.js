/**
 *
 */
runner.Gufetta.prototype = {
		init:function() {
			PrefOrientation=Phaser.Scale.PORTRAIT;
		},
		jumpPress:false,
		create:function() {
			this.dying = false;
			//this.game.scale.lockOrientation='landscape';
			//full screen button
			this.add.sprite(20,20,'fullscreen').setInteractive().on('pointerdown',function(obj){
	    		if (this.game.scale.isFullscreen) {
	    	        this.game.scale.stopFullscreen();
	    	        // On stop fulll screen
	    	    } else {
	    	    	this.game.scale.startFullscreen();
	    	        // On start fulll screen
	    	    }
	        },this);
			this.mid={x:this.game.width/2,y:this.game.height/2};
			// end frame
			var l=200;
			var h=100;
			EndFrame=this.add.graphics();
			EndFrame.setInteractive();
			EndFrame.fillStyle(0x000000, 1);
			EndFrame.fillRect(this.mid.x-l/2,this.mid.y-h/2,l, h);
			
			/*
			 * EndFrame.on('pointerdown',function(event){
			 * this.scene.start("Gatto"); },this);
			 */
			text=this.add.text(this.mid.x,this.mid.y-20,'Game Over',{color:'#ffffff'});
			text.setOrigin(0.5);
			this.finalScoreText=this.add.text(this.mid.x,this.mid.y+10,'Score :',{color:'#ffffff'}).setOrigin(0.5);
			this.endGroup=this.add.group();
			this.endGroup.add(EndFrame).add(text).add(this.finalScoreText);
			this.endGroup.setVisible(false);
			this.endGroup.setDepth(4);
			//background
			this.cameras.main.setBackgroundColor('#191970');
			this.add.sprite(100,10,'moon').setDepth(0).setOrigin(0).setScale(0.5);
			//set animation
			this.anims.create({
	            key: "fly",
	            frames: this.anims.generateFrameNumbers("gufetta", {
	                start: 0,
	                end: 1
	            }),
	            frameRate: 3,
	            
	            repeat: 1
	        });
			 // group with all active mountains.
	        this.PalaceGroup = this.add.group();

	        // group with all active platforms.
	        this.platformGroup = this.add.group({
	        	  // once a platform is removed, it's added to the pool
	            removeCallback: function(platform){
	                platform.scene.platformPool.add(platform);
	            }
	        });
	        this.platformPool = this.add.group({

	            // once a platform is removed from the pool, it's added to
				// the active platforms group
	            removeCallback: function(platform){
	                platform.scene.platformGroup.add(platform);
	            }
	        });
	        // adding a mountain
	        this.addPalace();
	        
	        // adding the player;
	        this.player = this.physics.add.sprite(gameOptions.playerStartPosition, this.game.height * 0.6, "gufetta");
	        this.player.setGravityY(gameOptions.playerGravity);
	        this.player.setDepth(3);
	        
	        // checking for input
	        this.input.on("pointerdown", this.jump, this);
	        this.input.on("pointerup",function(){this.jumpPress=false;},this);
	        this.input.keyboard.on("keyup",function(obj){if (obj.code=="Space") this.jumpPress=false;},this);
	        this.input.keyboard.on("keydown",function(obj) {
	            if (obj.code=="Space")
	            this.jump.call(this,obj);
	        }, this);
	        
		},
		addPalace : function(){
	        let rightmostPalace = this.getRightmostPalace();
	        if(rightmostPalace < game.config.width * 2){
	            let Palace = this.physics.add.sprite(rightmostPalace + Phaser.Math.Between(100, 350), game.config.height + Phaser.Math.Between(0, 100), "skyline");
	            Palace.setScale(0.8);
	            Palace.setOrigin(0.5, 1);
	            Palace.body.setVelocityX(gameOptions.mountainSpeed * -1);
	            this.PalaceGroup.add(Palace);
	            if(Phaser.Math.Between(0, 1)){
	            	Palace.setDepth(1);
	            }
	            Palace.setFrame(Phaser.Math.Between(0, 5));
	            this.addPalace();
	        }
	    },
	    getRightmostPalace : function(){
	        let rightmostPalace = -200;
	        this.PalaceGroup.getChildren().forEach(function(Palace){
	            rightmostPalace = Math.max(rightmostPalace, Palace.x);
	        })
	        return rightmostPalace;
	    },
	    jump : function(){
	    	this.jumpPress=true;
	    	if ((!this.dying)&&(this.player.y>this.player.height)){
	            
	            this.player.setVelocityY(gameOptions.jumpForce * -1);
	            //@todo add jump animation
	            //this.player.anims.play("fly");
	            
	        }
	        if (this.gameover) {
	        	this.scene.start("Gufetta");
	        	this.gameover=false;
	        	this.Score=this.time.now;
	        	this.finalScoreSet=false;
	        }
	    },
	    setObjVel : function(v,obj) {
	    	if ((obj=="all")||(obj=="Palace")) 
	    		this.PalaceGroup.getChildren().forEach(function(child,index){
	    			child.body.setVelocityX(v);
	    		});
	    	
	    	if ((obj!="Palace")||(obj=="all")) {
	    		this.platformGroup.getChildren().forEach(function(child,index){
		    		child.body.setVelocityX(v);
		    	});
	    		this.platformPool.getChildren().forEach(function(child,index){
		    		child.body.setVelocityX(v);
		    	});
	    	}
	    	
	    },
		update:function() {
			if (this.jumpPress) this.player.setFrame(1); else this.player.setFrame(0);
			// game over
	        if(this.player.y > game.config.height){
	        	this.endGroup.setVisible(true);
	        	this.gameover=true;
	        	this.setObjVel(0,"all");
	        	/*if (!this.finalScoreSet) {
	        		this.finalScoreSet=true;
	        		this.finalScore=(this.time.now-this.Score);
	        		
	        		if (localStorage.getItem('Score')<this.finalScore) {
	        			localStorage.setItem('Score',this.finalScore);
	        		}
	        		this.finalScoreText.setText('Score: '+this.finalScore+'\nrecord: '+localStorage.getItem('Score')).setDepth(5);
	        	}*/
	        }

	        this.player.x = gameOptions.playerStartPosition;
	        // recycling palace
	        this.PalaceGroup.getChildren().forEach(function(Palace){
	            if(Palace.x < - Palace.displayWidth){
	                let rightmostPalace = this.getRightmostPalace();
	                Palace.x = rightmostPalace + Phaser.Math.Between(100, 350);
	                Palace.y = game.config.height + Phaser.Math.Between(0, 100);
	                Palace.setFrame(Phaser.Math.Between(0, 3))
	                if(Phaser.Math.Between(0, 1)){
	                	Palace.setDepth(1);
	                }
	            }
	        }, this);
		}
}
