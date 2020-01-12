/**
 * 
 * @param text String text to write
 * @param time Integer actual time
 * @param delay Integer time beetween two lecter
 * @returns String
 */
function typeInAnimation(text,time,delay){
    var n,r='';
    // delay is optional, set default value
    if (!delay) delay=100;
    //whit some delay, how mutch step we have already does?
    n=parseInt(time/delay)+1;
    if (n>=text.length) return text;
    //type all text is step is over the length
    for (var i=0;i<n;i++) 
    {
        r+=text.charAt(i);
    }
    return r;
}
/**
 * 
 * 
 * @param text Array acronym to build , for example UFO -> [Unknown,Flying,Object]
 * @param time Integer actual time
 * @param delay Integer time beetween two lecter
 * @returns String 
 */
function typeInAcronym(text,time,delay) {
	// delay is optional, set default value
    if (!delay) delay=100;
    //controll if text is array
    if (!Array.isArray(text)) return "Error text isn't array";
    //n number of lecter write, l number of lecter to do write
    var n=0,l=0,r='';
    //whit some delay, how mutch step we have already does?
    l=parseInt(time/delay)+1;
    // initials array
    for (var i=0;i<text.length;i++) {
    	for (var j=0;(n<l && j<text[i].length)|| j==0;j++,n++)
        	//writing loop, typing at least the first lecter (j==0)
            r+=text[i].charAt(j);
        if (n<=l) r+=' ';// type the space only if we have write the word for integer
    }
    r.substring(0, r.length-1);// remove the final 'Space'
    return r;
}

function controllOrientation(orientation) {
	if ((this.game.scale.orientation!=orientation)&&!this.game.device.os.desktop) {
		document.getElementById('turn').style='display:block';
	}
	else document.getElementById('turn').style='display:none';
	resize();
}