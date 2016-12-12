var buttons = function() {};

buttons.prototype.options = {

};

buttons.prototype.init = function() {
	//var self = this;

	$(this).trigger('ready');
};

buttons.prototype.createShape = function(type, p) {
	var shape = new PIXI.Graphics;
	var shadow = new PIXI.Graphics;
	shape.lineStyle(p.lineWidth, p.lineColor, p.alpha||1);
	var fillColor = p.fillColor !== undefined ? p.fillColor : 0x777777;
	
	switch (type) {
		case "shadowBox" :
			shape.lineStyle(p.lineWidth, 0xFFFFFF, 1);
			shape.beginFill(fillColor, 1);
			shadow.beginFill(0x777777, .22);
			shadow.drawRoundedRect(p.x - .5, p.y - .5, p.width, p.height, 7);
			shape.drawRoundedRect(p.x - .5, p.y - .5, p.width, p.height, 7);
			shape.endFill();
			shadow.endFill();
			return [shape, shadow]; 
			break;
		case "simpleBox" :
//			shape.beginFill(fillColor, 1);
			shape.lineStyle(p.lineWidth, fillColor, 1);
			shape.drawRoundedRect(p.x - .5, p.y - .5, p.width, p.height, 7);
//			shape.endFill();
			break;
		case "containerBox" :
			shape.beginFill(fillColor, 1);
			shape.lineStyle(1, p.lineColor, p.alpha||1);
			shape.drawRect(p.x - .5, p.y - .5, p.width, p.height, 7);
			shape.endFill();
			break;
		case "handle" :
			shape.beginFill(fillColor, 1);
			shape.drawRoundedRect(p.x, p.y, p.width, p.height, 2);
			shape.endFill();
			break;
		case "disc" :
			shape.beginFill(fillColor, 1);
			shape.drawCircle(p.x, p.y, p.radius);
			shape.endFill();
			break;

		default : return;
	} 
	return shape;
};

buttons.prototype.createButton = function(type, text, p) {
	
	var title = new PIXI.Text('',{font : '15px Fjalla One', fill : (typeof p.lineColor !== 'undefined' ? p.lineColor : 0xFFFFFF), align : 'center'});
	title.text = text.length !== 0 ? text : title.text;
	
	var texture = PIXI.Texture.fromImage(p.iconURL || './images/empty.png');
	var icon = new PIXI.Sprite(texture);
	icon.position = {x : 15, y : 7};
	icon.height = p.iconHeight || 1;
	icon.width = p.iconWidth || 1;
	
	title.position = {x : icon.position.x + icon.width - 2, y : icon.position.y + 2 + (icon.height > 1 ? (icon.height / 2 - title.height / 2) : 0)};

	var width = this.computeTextWidth(text, 'Fjalla One', '16px') + icon.width ;
	var height = icon.height > 1 ? icon.height : title.height + 2;	
	
	switch (p.design) {
		case 'heavy' : 
			var shapeArray = this.createShape('shadowBox', {x : 0, y : 0, width : width + 25, height : height + 17, fillColor : p.fillColor, lineColor : p.lineColor});
			break;
		case 'simpleBox' : 
			var shapeArray = this.createShape('simpleBox', {x : 0, y : 0, width : width + 25, height : height + 17, fillColor : p.fillColor, lineColor : p.lineColor});
	}
	
	if ($.isArray(shapeArray) === true) {
		
		var frontShape = new PIXI.Sprite(shapeArray[0].generateTexture(renderer));
		frontShape.position = {x : - 3, y : - 3};
		frontShape.interactive = true;
		frontShape.buttonMode = true;
		icon.interactive = true;
		icon.buttonMode = true;
		
		frontShape.addChild(icon)
		frontShape.addChild(title)
		
		var shape = shapeArray[1];
		shape.addChild(frontShape);
		shape.position = p.position || {x : 0, y : 0};
	}
	else {
		var shape = new PIXI.Sprite(shapeArray.generateTexture(renderer));
		
		shape.addChild(icon)
		shape.addChild(title);
		
		icon.interactive = true;
		icon.buttonMode = true;
		shape.interactive = true;
		shape.buttonMode = true;
		shape.position = p.position || {x : 0, y : 0};
	}

	if (type == 'toggle') {
		shape.toggle = "off";
	}
	
	shape.index = p.index;
	
	return shape;
}

buttons.prototype.computeTextWidth = function(string, fontFamily, fontSize, fontWeight) {
	if (typeof fontWeight === 'undefined') fontWeight = "normal"; 
	var div = document.createElement('div');
	div.textContent = string;
	div.style.position = 'absolute';
	div.style.opacity = 0;
	div.style.border = '1px solid #000';
	div.style.fontFamily = fontFamily;
	div.style.fontSize = fontSize;
	div.style.fontWeight = fontWeight;
	document.body.appendChild(div);
	var w = div.clientWidth;
	document.body.removeChild(div);
	return w;
}