var graphUtils = function() {};

graphUtils._colorLookup = {aqua:[0,255,255],
		lime:[0,255,0],
		silver:[192,192,192],
		black:[0,0,0],
		maroon:[128,0,0],
		teal:[0,128,128],
		blue:[0,0,255],
		navy:[0,0,128],
		white:[255,255,255],
		fuchsia:[255,0,255],
		olive:[101,184,0],
		yellow:[255,255,0],
		orange:[255,165,0],
		gray:[128,128,128],
		purple:[128,0,128],
		green:[0,128,0],
		red:[255,0,0],
		pink:[255,192,203],
		cyan:[0,255,255],
		transparent:[255,255,255,0],
		youngleaf : [144, 238, 101],
		deepgreen : [24, 144, 24],
		aquagreen : [84, 201, 22],
		softlime : [12, 238, 12],
		lightgreen : [38, 188, 24],
		atomicolive : [121, 238, 24]
}

graphUtils._colorIndex = ['aqua',
		'lime',
		'maroon',
		'teal',
		'blue',
		'navy',
		'fuchsia',
		'olive',
		'yellow',
		'orange',
		'purple',
		'green',
		'cyan'
]

graphUtils._specialColorIndex = ['aquagreen',
                  		'softlime',
                  		'youngleaf',
                  		'teal',
                  		'deepgreen',
                  		'atomicolive',
                  		'yellow',
                  		'lightgreen'
                  ]

graphUtils.parseColor = function(color) {
	if (color === "" || color == null || color === "none") {
		return this._colorLookup.transparent;
	}
	if (typeof(color) === "number") {
		return [color >> 16, (color >> 8) & 255, color & 255];
	}
};

graphUtils.componentToHex = function (c) {
	if (c > 255) c = 255; 
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
};

graphUtils.lighterColor = function(c) {
	var offset = 38;
	return typeof c !== 'undefined' ? this.offsetColor(c, offset) : undefined;
}

graphUtils.darkerColor = function(c) {
	var offset = -38;
	return typeof c !== 'undefined' ? this.offsetColor(c, offset) : undefined;
}

graphUtils.softerColor = function(c) {
	var color = this.parseColor(c);
	var r = "", i = 0, max = 0, min = 255, diff = 0, bounds = [];
	
	for (p in color) {
		if (color[p] > max) {
			max = color[p];
			bounds[1] = p; 
		}
		if (color[p] < min) {
			min = color[p];
			bounds[0] = p;
		}
		diff = color[bounds[1]] - color[bounds[0]];
	}
	
	for (p in color) {
		if (p == max)
			color[p] = Math.floor(color[p] + diff * .44);
		else 
			color[p] = Math.floor(color[p] + diff * .77);
		r = r + this.componentToHex(color[p]);
	}
	return parseInt("0x" + r);
};

graphUtils.offsetColor = function(c, offset) {
	var color = this.parseColor(c);
	var r = "", i = 0;
	for (p in color) {
		r = r + this.componentToHex(color[p] + offset);
	}
	return parseInt("0x" + r);
}

graphUtils.colorFromTable2Hexa = function(c) {
	var r = "", i = 0;
	for (p in c) {
		r = r + this.componentToHex(c[p]);
	}
	return parseInt("0x" + r);
}

graphUtils.stringWidthFromLength = function(string, fontFamily, fontSize, fontWeight) {
	if (typeof fontWeight === 'undefined') fontWeight = "normal"; 
	var div = document.createElement('div');
	div.textContent = string;
	div.style.position = 'absolute';
	div.style.opacity = 0;
	div.style.fontFamily = fontFamily;
	div.style.fontSize = fontSize;
	div.style.fontWeight = fontWeight;
	document.body.appendChild(div);
	var w = div.clientWidth;
	document.body.removeChild(div);
	return w;
}

graphUtils.blockHeightFromLength = function(string, fontFamily, fontSize, fontWeight) {
	if (typeof fontWeight === 'undefined') fontWeight = "normal"; 
	var div = document.createElement('div');
	div.textContent = string;
	div.style.position = 'absolute';
	div.style.opacity = 0;
	div.style.fontFamily = fontFamily;
	div.style.fontSize = fontSize;
	div.style.fontWeight = fontWeight;
	document.body.appendChild(div);
	var h = div.clientHeight;
	document.body.removeChild(div);
	return h;
}

graphUtils.decodeHtml = function(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}