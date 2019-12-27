function typeInAnimation(text,time,delay){
    var n,r='';
    if (!delay) delay=100;
    n=parseInt(time/delay)+1;
    if (n>=text.length) return text;
    for (var i=0;i<n;i++) 
    {
        r+=text.charAt(i);
    }
    return r;
}

function typeInAcronym(text,time,delay) {
    if (!delay) delay=100;
    if (!Array.isArray(text)) return "Error text isn't array";
    var n=0,l=0,r='';
    l=parseInt(time/delay)+1;
    for (var i=0;i<text.length;i++) {
        for (var j=0;(n<l && j<text[i].length)|| j==0;j++,n++)
            r+=text[i].charAt(j);
        if (n<=l) r+=' ';
    }
    r.substring(0, r.length-1);
    return r;
}

/**
 * validate the savegame
 * @param content String
 * @param notParse boolean
 * @return boolean
 * 
 * save - i int 0 1 2
 * 		- last int timestamp
 * 		- playerName String
 * 		- difficulty 1 2 3
 * 		- progress int
 * @todo add data
 * 
 */
function validateSave(content,notParse) {
	var obj=null;
	if (notParse) obj=content;
	else {
		try {
			var obj=JSON.parse(content);
		}
		catch (e) {
			obj=false;
		}
	}
	bool=true;
	if (obj) {
		bool=bool&&(obj.i>=0)&&(obj.i<=2);
		bool=bool&&(obj.last);
		bool=bool&&(obj.playerName);
		bool=bool&&(obj.difficulty>=1)&&(obj.difficulty<=3);
		bool=bool&&(Number.isInteger(obj.progress));
		//bool=bool&&();
		//@todo add more controll if add data
	}
	else bool=false;
	return bool;
}

function loadGame(event) {
	console.log("carico il salvataggio "+this.i,this.save);
	game.sendButton.i=this.i;
	if (this.save) {
		game.data=this.save;
		game.scene.start("Intro");
		  game.scene.stop("Game");
	}
	else {
		game.createSave.style.display="block";
		game.easyButton.onclick=function () {
			game.easyButton.className="diff selected";
			game.normalButton.className="diff";
			game.hardButton.className="diff";
			game.difficulty.value=1;
		};
		game.normalButton.onclick=function () {
			game.normalButton.className="diff selected";
			game.easyButton.className="diff";
			game.hardButton.className="diff";
			game.difficulty.value=2;
		};
		game.hardButton.onclick=function () {
			game.hardButton.className="diff selected";
			game.normalButton.className="diff";
			game.easyButton.className="diff";
			game.difficulty.value=3;
		};
		game.sendButton.onclick=function () {
			this.save={
					i:this.i,
					last:new Date().getTime(),
					playerName:document.getElementById("name").value,
					difficulty:game.difficulty.value,
					progress:0
					//@todo control this code if add data un save game
			};
			if (!validateSave(this.save,true)) this.save=false;
			if (this.save) localStorage.setItem("slot"+(this.i+1),JSON.stringify(this.save));
			game.createSave.style.display="none";
			loadGame.call(this);
		};
	}
}

function saveGame(save) {
	if (save) {
		save.last=new Date().getTime();
		localStorage.setItem("slot"+(save.i+1),JSON.stringify(save));
	}
	
}