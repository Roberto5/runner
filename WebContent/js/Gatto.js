
runner.Gatto.prototype = {
		ncoin : 0,
		Score : 0,
		gameover : false,
		turbo: false,
		turboUsed:0,
		lastTimeTurbo:0,
		create : function() {
			this.game.scale.lockOrientation='landscape';
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
			var l=200;
			var h=100;
			EndFrame=this.add.graphics();
			EndFrame.setInteractive();
			EndFrame.fillStyle(0x000000, 1);
			EndFrame.fillRect(this.game.width/2-l/2,this.game.height/2-h/2,l, h);
			
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
			
			this.ncoin=0;
			this.cameras.main.setBackgroundColor('#191970');
			
			this.add.sprite(this.game.width-50,20,'coin').setDepth(4);
			this.coinCounter=this.add.text(this.game.width-30,10,'0');
			this.coinCounter.setDepth(4);
			this.ScoreText=this.add.text(this.game.width-200,10,'Score: 0').setDepth(4);
			this.Score=this.time.now;
			//moon
			this.add.sprite(100,10,'moon').setDepth(0).setOrigin(0).setScale(0.5);
			// setting player animation
		    this.anims.create({
		            key: "run",
		            frames: this.anims.generateFrameNumbers("gattoboy", {
		                start: 0,
		                end: 2
		            }),
		            frameRate: 15,
		            repeat: -1
		        });
		    // turbo animation
		    this.anims.create({
	            key: "turbo",
	            frames: this.anims.generateFrameNumbers("gattoboy", {
	                start: 5,
	                end: 7
	            }),
	            frameRate: 20,
	            repeat: -1
	        });

		        // setting coin animation
		        this.anims.create({
		            key: "rotate",
		            frames: this.anims.generateFrameNumbers("coin", {
		                start: 0,
		                end: 5
		            }),
		            frameRate: 15,
		            yoyo: true,
		            repeat: -1
		        });

		        // setting fire animation
		        this.anims.create({
		            key: "burn",
		            frames: this.anims.generateFrameNumbers("fire", {
		                start: 0,
		                end: 4
		            }),
		            frameRate: 15,
		            repeat: -1
		        });
		    

		        // group with all active mountains.
		        this.mountainGroup = this.add.group();

		        // group with all active platforms.
		        this.platformGroup = this.add.group({

		            // once a platform is removed, it's added to the pool
		            removeCallback: function(platform){
		                platform.scene.platformPool.add(platform);
		            }
		        });

		        // platform pool
		        this.platformPool = this.add.group({

		            // once a platform is removed from the pool, it's added to
					// the active platforms group
		            removeCallback: function(platform){
		                platform.scene.platformGroup.add(platform);
		            }
		        });

		        // group with all active coins.
		        this.coinGroup = this.add.group({

		            // once a coin is removed, it's added to the pool
		            removeCallback: function(coin){
		                coin.scene.coinPool.add(coin);
		            }
		        });

		        // coin pool
		        this.coinPool = this.add.group({

		            // once a coin is removed from the pool, it's added to the
					// active coins group
		            removeCallback: function(coin){
		                coin.scene.coinGroup.add(coin);
		            }
		        });

		        // group with all active firecamps.
		        this.fireGroup = this.add.group({

		            // once a firecamp is removed, it's added to the pool
		            removeCallback: function(fire){
		                fire.scene.firePool.add(fire);
		            }
		        });

		        // fire pool
		        this.firePool = this.add.group({

		            // once a fire is removed from the pool, it's added to the
					// active fire group
		            removeCallback: function(fire){
		                fire.scene.fireGroup.add(fire);
		            }
		        });

		        // adding a mountain
		        this.addMountains();

		        // keeping track of added platforms
		        this.addedPlatforms = 0;

		        // number of consecutive jumps made by the player so far
		        this.playerJumps = 0;

		        // adding a platform to the game, the arguments are platform
				// width, x position and y position
		        this.addPlatform(this.game.width, this.game.width / 2, this.game.height * gameOptions.platformVerticalLimit[1]);

		        // adding the player;
		        this.player = this.physics.add.sprite(gameOptions.playerStartPosition, this.game.height * 0.6, "gattoboy");
		        this.player.setGravityY(gameOptions.playerGravity);
		        this.player.setDepth(3);
		        
		     	// set trails
				this.trails=new Array(4);
				this.trailpos=[-30,0,30,50];
				for (var j=0;j<this.trails.length;j++){
					this.trails[j]=new Array(30);
					for (var i=0;i<this.trails[j].length;i++) {
						y=this.player.y+this.trailpos[j];
						this.trails[j][i]=this.physics.add.sprite(gameOptions.playerStartPosition-10-2*i,y,'gattoboyparticle');
						this.trails[j][i].setDepth(2);
						this.trails[j][i].visible=false;
					}
				}
				this.trailsGroup=this.add.group();
				for (var j=0;j<this.trails.length;j++)
				this.trailsGroup.addMultiple(this.trails[j]);
				
		        // the player is not dying
		        this.dying = false;

		        // setting collisions between the player and the platform group
		        this.platformCollider = this.physics.add.collider(this.player, this.platformGroup, function(){

		            // play "run" animation if the player is on a platform
		            if(!this.player.anims.isPlaying){
		            	if (this.turbo) this.player.anims.play('turbo');
		            	else this.player.anims.play("run");
		            }
		        }, null, this);

		        // setting collisions between the player and the coin group
		        this.physics.add.overlap(this.player, this.coinGroup, function(player, coin){
					if (this.prevcoin!=coin) {
						this.ncoin++;
						this.Score-=gameOptions.pointForCoin;
						this.prevcoin=coin;
						this.tweens.add({
			                targets: coin,
			                y: coin.y - 100,
			                alpha: 0,
			                duration: 800,
			                ease: "Cubic.easeOut",
			                callbackScope: this,
			                onComplete: function(){
			                    this.coinGroup.killAndHide(coin);
			                    this.coinGroup.remove(coin);
			                    this.prevcoin=null;
			                }
			            });
					}
		        	

		        }, null, this);

		        // setting collisions between the player and the fire group
		        this.physics.add.overlap(this.player, this.fireGroup, function(player, fire){
					
		            this.dying = true;
		            this.player.anims.stop();
		            this.player.setFrame(3);
		            this.player.body.setVelocityY(-200);
		            this.physics.world.removeCollider(this.platformCollider);
		        }, null, this);

		        // checking for input
		        this.input.on("pointerdown", this.jump, this);
		        this.input.keyboard.on("keydown",function(obj) {
		            if (obj.code=="Space")
		            this.jump.call(this,obj);
		        }, this);
		    },
		    setObjVel : function(v,obj) {
		    	if ((obj=="all")||(obj=="mointains")) 
		    		this.mountainGroup.getChildren().forEach(function(child,index){
		    			child.body.setVelocityX(v);
		    		});
		    	
		    	if ((obj!="mointains")||(obj=="all")) {
		    		this.platformGroup.getChildren().forEach(function(child,index){
			    		child.body.setVelocityX(v);
			    	});
		    		this.platformPool.getChildren().forEach(function(child,index){
			    		child.body.setVelocityX(v);
			    	});
			    	this.coinGroup.getChildren().forEach(function(child,index){
			    		child.body.setVelocityX(v);
			    	});
			    	this.coinPool.getChildren().forEach(function(child,index){
			    		child.body.setVelocityX(v);
			    	});
			    	this.fireGroup.getChildren().forEach(function(child,index){
			    		child.body.setVelocityX(v);
			    	});
			    	this.firePool.getChildren().forEach(function(child,index){
			    		child.body.setVelocityX(v);
			    	});
		    	}
		    	
		    },
		    // adding mountains
		    addMountains : function(){
		        let rightmostMountain = this.getRightmostMountain();
		        if(rightmostMountain < game.config.width * 2){
		            let mountain = this.physics.add.sprite(rightmostMountain + Phaser.Math.Between(100, 350), game.config.height + Phaser.Math.Between(0, 100), "skyline");
		            mountain.setScale(0.8);
		            mountain.setOrigin(0.5, 1);
		            mountain.body.setVelocityX(gameOptions.mountainSpeed * -1);
		            this.mountainGroup.add(mountain);
		            if(Phaser.Math.Between(0, 1)){
		                mountain.setDepth(1);
		            }
		            mountain.setFrame(Phaser.Math.Between(0, 5));
		            this.addMountains();
		        }
		    },

		    // getting rightmost mountain x position
		    getRightmostMountain : function(){
		        let rightmostMountain = -200;
		        this.mountainGroup.getChildren().forEach(function(mountain){
		            rightmostMountain = Math.max(rightmostMountain, mountain.x);
		        })
		        return rightmostMountain;
		    },

		    // the core of the script: platform are added from the pool or
			// created on the fly
		    addPlatform : function(platformWidth, posX, posY){
		        this.addedPlatforms ++;
		        let platform;
		        if(this.platformPool.getLength()){
		            platform = this.platformPool.getFirst();
		            platform.x = posX;
		            platform.y = posY;
		            platform.active = true;
		            platform.visible = true;
		            this.platformPool.remove(platform);
		            let newRatio =  platformWidth / platform.displayWidth;
		            platform.displayWidth = platformWidth;
		            platform.tileScaleX = 1 / platform.scaleX;
		        }
		        else{
		            platform = this.add.tileSprite(posX, posY, platformWidth, 32, "platform");
		            this.physics.add.existing(platform);
		            platform.body.setImmovable(true);
		            platform.body.setVelocityX(Phaser.Math.Between(gameOptions.platformSpeedRange[0], gameOptions.platformSpeedRange[1]) * -1);
		            platform.setDepth(2);
		            this.platformGroup.add(platform);
		        }
		        this.nextPlatformDistance = Phaser.Math.Between(gameOptions.spawnRange[0], gameOptions.spawnRange[1]);

		        // if this is not the starting platform...
		        if(this.addedPlatforms > 1){

		            // is there a coin over the platform?
		            if(Phaser.Math.Between(1, 100) <= gameOptions.coinPercent){
		                if(this.coinPool.getLength()){
		                    let coin = this.coinPool.getFirst();
		                    coin.x = posX;
		                    coin.y = posY - 96;
		                    coin.alpha = 1;
		                    coin.active = true;
		                    coin.visible = true;
		                    this.coinPool.remove(coin);
		                }
		                else{
		                    let coin = this.physics.add.sprite(posX, posY - 96, "coin");
		                    coin.setImmovable(true);
		                    coin.setVelocityX(platform.body.velocity.x);
		                    coin.anims.play("rotate");
		                    coin.setDepth(2);
		                    this.coinGroup.add(coin);
		                }
		            }

		            // is there a fire over the platform?
		            if(Phaser.Math.Between(1, 100) <= gameOptions.firePercent){
		                if(this.firePool.getLength()){
		                    let fire = this.firePool.getFirst();
		                    fire.x = posX - platformWidth / 2 + Phaser.Math.Between(1, platformWidth);
		                    fire.y = posY - 46;
		                    fire.alpha = 1;
		                    fire.active = true;
		                    fire.visible = true;
		                    this.firePool.remove(fire);
		                }
		                else{
		                    let fire = this.physics.add.sprite(posX - platformWidth / 2 + Phaser.Math.Between(1, platformWidth), posY - 46, "fire");
		                    fire.setImmovable(true);
		                    fire.setVelocityX(platform.body.velocity.x);
		                    fire.setSize(8, 2, true)
		                    fire.anims.play("burn");
		                    fire.setDepth(2);
		                    this.fireGroup.add(fire);
		                }
		            }
		        }
		    },

		    // the player jumps when on the ground, or once in the air as long
			// as there are jumps left and the first jump was on the ground
		    // and obviously if the player is not dying
		    jump : function(){
		    	var maxjump=gameOptions.jumps;
		    	if (this.turbo) maxjump*=2;
		        if((!this.dying) && (this.player.body.touching.down || (this.playerJumps > 0 && this.playerJumps < maxjump))){
		            if(this.player.body.touching.down){
		                this.playerJumps = 0;
		            }
		            this.player.setVelocityY(gameOptions.jumpForce * -1);
		            this.playerJumps ++;

		            // stops animation
		            this.player.anims.stop();
		            // ad jump animation
		            if (this.turbo) this.player.setFrame(9);
		            else this.player.setFrame(4);
		        }
		        if (this.gameover) {
		        	this.scene.start("Gatto");
		        	this.gameover=false;
		        	this.Score=this.time.now;
		        	this.finalScoreSet=false;
		        }
		    },

		    update : function(){
		    	if (!this.gameover) this.ScoreText.setText('Score: '+(this.time.now-this.Score));
				this.coinCounter.setText(''+this.ncoin);
				this.trailsGroup.setVisible(this.turbo);
				for (var j=0;j<this.trails.length&&this.turbo;j++)
				{
					var prev={x:this.player.x,y:this.player.y+this.trailpos[j]};
					for(var i=0;i<this.trails[j].length;i++) {
						this.trails[j][i].visible=true;
						temp={x:this.trails[j][i].x,y:this.trails[j][i].y};
						a=Phaser.Math.Angle.Between(this.trails[j][i].x,this.trails[j][i].y,prev.x,prev.y);
						a*= (180/Math.PI);
						this.trails[j][i].angle=a;
						this.trails[j][i].setScale(1+Math.abs(a)/90,1);
						if (this.trails[j][i].y-prev.y!=0) {this.trails[j][i].y=prev.y;}
						prev=temp;
					}
				}
		        // game over
		        if(this.player.y > game.config.height){
		        	this.endGroup.setVisible(true);
		        	this.gameover=true;
		        	this.setObjVel(0,"all");
		        	this.turboUsed=0;
		        	this.turbo=false;
		        	if (!this.finalScoreSet) {
		        		this.finalScoreSet=true;
		        		this.finalScore=(this.time.now-this.Score);
		        		
		        		if (localStorage.getItem('Score')<this.finalScore) {
		        			localStorage.setItem('Score',this.finalScore);
		        		}
		        		this.finalScoreText.setText('Score: '+this.finalScore+'\nrecord: '+localStorage.getItem('Score')).setDepth(5);
		        	}
		        }

		        this.player.x = gameOptions.playerStartPosition;

		        // recycling platforms
		        let minDistance = game.config.width;
		        let rightmostPlatformHeight = 0;
		        this.platformGroup.getChildren().forEach(function(platform){
		            let platformDistance = game.config.width - platform.x - platform.displayWidth / 2;
		            if(platformDistance < minDistance){
		                minDistance = platformDistance;
		                rightmostPlatformHeight = platform.y;
		            }
		            if(platform.x < - platform.displayWidth / 2){
		                this.platformGroup.killAndHide(platform);
		                this.platformGroup.remove(platform);
		            }
		        }, this);

		        // recycling coins
		        this.coinGroup.getChildren().forEach(function(coin){
		            if(coin.x < - coin.displayWidth / 2){
		                this.coinGroup.killAndHide(coin);
		                this.coinGroup.remove(coin);
		            }
		        }, this);

		        // recycling fire
		        this.fireGroup.getChildren().forEach(function(fire){
		            if(fire.x < - fire.displayWidth / 2){
		                this.fireGroup.killAndHide(fire);
		                this.fireGroup.remove(fire);
		            }
		        }, this);

		        // recycling mountains
		        this.mountainGroup.getChildren().forEach(function(mountain){
		            if(mountain.x < - mountain.displayWidth){
		                let rightmostMountain = this.getRightmostMountain();
		                mountain.x = rightmostMountain + Phaser.Math.Between(100, 350);
		                mountain.y = game.config.height + Phaser.Math.Between(0, 100);
		                mountain.setFrame(Phaser.Math.Between(0, 3))
		                if(Phaser.Math.Between(0, 1)){
		                    mountain.setDepth(1);
		                }
		            }
		        }, this);

		        // adding new platforms
		        if(minDistance > this.nextPlatformDistance){
		            let nextPlatformWidth = Phaser.Math.Between(gameOptions.platformSizeRange[0], gameOptions.platformSizeRange[1]);
		            let platformRandomHeight = gameOptions.platformHeighScale * Phaser.Math.Between(gameOptions.platformHeightRange[0], gameOptions.platformHeightRange[1]);
		            let nextPlatformGap = rightmostPlatformHeight + platformRandomHeight;
		            let minPlatformHeight = game.config.height * gameOptions.platformVerticalLimit[0];
		            let maxPlatformHeight = game.config.height * gameOptions.platformVerticalLimit[1];
		            let nextPlatformHeight = Phaser.Math.Clamp(nextPlatformGap, minPlatformHeight, maxPlatformHeight);
		            this.addPlatform(nextPlatformWidth, game.config.width + nextPlatformWidth / 2, nextPlatformHeight);
		        }
		        // active turbo
		        // @TODO auto turbo or turbo button?
		        // now use auto turbo
		        if ((this.ncoin>=gameOptions.turboReq+this.turboUsed)&&(!this.gameover)) {
		        	if (!this.turbo) {
		        		//play sound
		        		this.sound.play('gattoTurbo')
		        	}
		        	this.turboUsed+=gameOptions.turboReq;
		        	this.setObjVel(-gameOptions.platformSpeedRange[0]*2);
		        	if (this.turbo) this.lastTimeTurbo+=gameOptions.turboDuration*1000;
		        	else this.lastTimeTurbo=this.time.now;
		        	this.turbo=true;
		        }
		        if ((this.time.now>=this.lastTimeTurbo+gameOptions.turboDuration*1000)&&this.turbo) {
		        	this.turbo=false;
		        	this.setObjVel(-gameOptions.platformSpeedRange[0]);
		        }
		    }
		}


