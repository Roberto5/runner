
// prepare the asset for loader screeen
runner.Boot.prototype = Phaser.Scene.prototype;
runner.Boot.prototype = {
   preload: function() {
	   this.load.json('pack', 'assets/pack.json'); //this not work
	   this.load.image('logo','assets/img/logo.png');//this work
       resize();
   },
  create: function(){
       this.game.scene.backgroundColor = '#000';
       this.game.height=this.game.canvas.height;
       this.game.width=this.game.canvas.width;
       document.getElementById("game").style.width = this.game.width + 10;
       document.getElementById("game").style.height = this.game.height+10;
       // language handler
       var preferredLanguage = navigator.language || navigator.userLanguage || navigator.browserLanguage || navigator.systemLanguage || this.defaultLanguage;
       if (preferredLanguage === null) {
           this.languageCode = 'en';
  	   } else if (preferredLanguage.length > 2) {
           this.languageCode = preferredLanguage.substr(0, 2);
           // already valid and only 2 characters long
       } else {
           this.languageCode = preferredLanguage;
       }
       lang=language[this.languageCode];
       console.log(this.cache.json.get('pack'));
  },
  update: function(){
      this.scene.start('Preloader');
  }
};

