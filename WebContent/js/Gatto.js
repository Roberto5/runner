
runner.Gatto.prototype = {
		/*preload :function() {
			blurPipeline = game.renderer.addPipeline('blur', new blurPipeline(game));
			blurPipeline.setFloat1('resolution', game.config.width);
			blurPipeline.setFloat1('radius', 5.0);
			blurPipeline.setFloat2('dir',10.0,0.0);
		},*/
		ncoin : 0,
		create : function() {
			this.ncoin=0;
			this.cameras.main.setBackgroundColor(0x0c88c7);
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
		    //turbo animation
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
				this.trailpos=[-30,0,30,50]
				this.trail=false;
				for (var j=0;j<this.trails.length;j++){
					this.trails[j]=new Array(30);
					for (var i=0;i<this.trails[j].length;i++) {
						y=this.player.y+this.trailpos[j];
						this.trails[j][i]=this.physics.add.sprite(gameOptions.playerStartPosition-10-2*i,y,'gattoboyparticle');
						this.trails[j][i].setDepth(2);
						this.trails[j][i].visible=false;
					}
				}
				
		        // the player is not dying
		        this.dying = false;

		        // setting collisions between the player and the platform group
		        this.platformCollider = this.physics.add.collider(this.player, this.platformGroup, function(){

		            // play "run" animation if the player is on a platform
		            if(!this.player.anims.isPlaying){
		                this.player.anims.play("run");
						//@todo add turbo animation
		            }
		        }, null, this);

		        // setting collisions between the player and the coin group
		        this.physics.add.overlap(this.player, this.coinGroup, function(player, coin){
					if (this.prevcoin!=coin) this.ncoin++;
					this.prevcoin=coin;
							console.log("ncoin ",this.ncoin);
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
							
		                }
		            });

		        }, null, this);

		        // setting collisions between the player and the fire group
		        this.physics.add.overlap(this.player, this.fireGroup, function(player, fire){
					
		            this.dying = true;
		            this.player.anims.stop();
		            this.player.setFrame(3);
		            this.player.body.setVelocityY(-200);
		            this.physics.world.removeCollider(this.platformCollider);
		            //this.particle.emitters.getFirst().stop();

		        }, null, this);

		        // checking for input
		        this.input.on("pointerdown", this.jump, this);
		        this.input.keyboard.on("keydown",function(obj) {
		            if (obj.code=="Space")
		            this.jump.call(this,obj);
		        }, this);
		    },

		    // adding mountains
		    addMountains : function(){
		        let rightmostMountain = this.getRightmostMountain();
		        if(rightmostMountain < game.config.width * 2){
		            let mountain = this.physics.add.sprite(rightmostMountain + Phaser.Math.Between(100, 350), game.config.height + Phaser.Math.Between(0, 100), "mountain");
		            mountain.setOrigin(0.5, 1);
		            mountain.body.setVelocityX(gameOptions.mountainSpeed * -1);
		            this.mountainGroup.add(mountain);
		            if(Phaser.Math.Between(0, 1)){
		                mountain.setDepth(1);
		            }
		            mountain.setFrame(Phaser.Math.Between(0, 3));
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
		        if((!this.dying) && (this.player.body.touching.down || (this.playerJumps > 0 && this.playerJumps < gameOptions.jumps))){
		            if(this.player.body.touching.down){
		                this.playerJumps = 0;
		            }
		            this.player.setVelocityY(gameOptions.jumpForce * -1);
		            this.playerJumps ++;

		            // stops animation
		            this.player.anims.stop();
		            // ad jump animation
		            this.player.setFrame(4);
		        }
		    },

		    update : function(){
				
				//trails animation @todo set angle?
				//this.player.angle++;
				
				for (var j=0;j<this.trails.length&&this.trail;j++)
				{
					var prev={x:this.player.x,y:this.player.y+this.trailpos[j]};
				for(var i=0;i<this.trails[j].length;i++) {
					this.trails[j][i].visible=true;
					//this.trails[i].angle++;
					temp={x:this.trails[j][i].x,y:this.trails[j][i].y};
					a=Phaser.Math.Angle.Between(this.trails[j][i].x,this.trails[j][i].y,prev.x,prev.y);
					//if (i==3) console.log('angolo '+i+': '+a);
					a*= (180/Math.PI);
					this.trails[j][i].angle=a;
					this.trails[j][i].setScale(1+Math.abs(a)/90,1);
					//this.trails[i].angle=Math.atan(Math.abs(prev.y-this.trails[i].y)/Math.abs(prev.x-this.trails[i].x));
					if (this.trails[j][i].y-prev.y!=0) {this.trails[j][i].y=prev.y;}
					//else if (this.trails[i].y-prev.y<0) this.trails[i].y++;
					prev=temp;
				}
				}
		        // game over
		        if(this.player.y > game.config.height){
		            this.scene.start("Gatto");
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
		    }
		}


