runner.Preloader.prototype = Phaser.Scene.prototype;
runner.Preloader.prototype = {
	init : function() {
		this.ready = false;
		/* for test progress bar*/
		this.date = new Date();
		this.time = 0;
		// */
	},
	preload : function() {
		this.preloadLogo = this.add.sprite(0, 0, 'logo');
		this.preloadLogo.x = this.game.width / 2;
		this.preloadLogo.y = this.game.height / 2;
		this.centerBar = [this.game.width / 2,this.game.height *0.65];
		this.preloadBar = this.add.graphics();
		this.dimBar=[this.preloadLogo.width*0.8,this.game.height * 0.1];
		this.preloadFrame = this.add.graphics();
		this.preloadFrame.fillStyle(0x222222, 0.8);
		this.preloadFrame.fillRect(this.centerBar[0]-this.dimBar[0]/2, this.centerBar[1]-this.dimBar[1]/2, this.dimBar[0], this.dimBar[1]);
		this.load.on('progress', function (value) {
		    console.log(value,(new Date()-this.date.getTime())/1000);
		    this.preloadBar.clear();
		    this.preloadBar.fillStyle(0xffffff, 1);
		    this.preloadBar.fillRect(this.centerBar[0]-this.dimBar[0]/2, this.centerBar[1]-this.dimBar[1]/2, this.dimBar[0] * value, this.dimBar[1]);
		},this);
		pack=this.cache.json.get('pack');
		for (var i=0;i<pack.preloader.length;i++) {
			var file=pack.preloader[i];
			switch (file.type) {
			case "image":this.load.image(file);break;
			case "spritesheet":
				file.frameConfig={ frameWidth: file.frameWidth, frameHeight: file.frameHeight};
				this.load.spritesheet(file);break;
			}
		}
		//this.load.pack('preloader','assets/pack.json'); not work
		/* for test progress bar*/
		/*this.load.setCORS('anonymous');
		this.load.setCORS('Anonymous');
		this.load.setCORS(true);
		this.load.audio('prova', 'assets/audio/prova.mp3');
		this.load.image('prova', 'https://cdn.crunchify.com/wp-content/uploads/2016/04/How-to-fix-Access-Control-Allow-Origin-issue-for-your-HTTPS-enabled-WordPress-site.png?q=' + Math.random(100));
		this.load.image('prova2', 'https://cdn.crunchify.com/wp-content/uploads/2016/04/How-to-fix-Access-Control-Allow-Origin-issue-for-your-HTTPS-enabled-WordPress-site.png?q=' + Math.random(100));
		 
		//*/
	},
	create : function() {
	},
	update : function() {
		this.scene.start('Logo');
	}
};
