if (!WG) 
	var WG = {};


WG.options = {
		masterGraph : false,
		defaultLineWidth : 1,
		defaultLineColor : 0x777777,
		defaultLineAlpha : 1,
		itemBgColor : 0xFFFFFF,
		itemBorderColor : 0xDADADA,
		defaultFontSize : '24px',
		defaultFontFamily : 'Arial Narrow',
		defaultFontWeight : '400',
		defaultFontColor : 0x000000,
		defaultFontAlign : 'left',
		defaultSubflow : 'neutral',
		defaultHandleHeight : 57,
		defaultHandleWidth : 7,
		defaultSplineWidth : 4,
		defaultBigSplineWidth : 12,
		defaultSplineColor : 0xDDDDDD,
		defaultSplineAlpha : .64,
		defaultTensionOffset : 22,
		variableAlpha : 1,
		defaultColors : {
			"input" : 0xAAAAAA,
			"neutral" : 0x999999,
			"special" : 0x000000,
			"com" : 0x6BAA25,
			"user" : 0x234A9C,
			"saisie" : 0x234A9C,
			"process" : 0x777777,
			"soft" : 0x991000,
			"worker" : 0xC7C7C7,
			"storage" : 0xC7C7C7,
			"warning" : 0xDD5961,
			"reclam" : 0x5AAA44,
			"redacReclam" : 0x999999,
			check : 0x999999,
			multi : 0x999999,
			redac : 0x999999, 
			prod : 0x999999,
			livraison : 0x999999,
			presta : 0x999999
		},
		graphStartingPoint : {x : 0, y : 0},
		defaultH_Interval : 84,
		defaultV_Interval : 12,
		superBoxHardScale : {x : 1, y : .5},
		randomOffsets : [7, 0, 12, 1, 15, 2, 9, 6, 1, 9, 5],
		icons : {
			warning : {
				url : relative + 'plugins/AW_Etude/images/warning.png',
				position : {x : -1, y : 1},
				rotation : 0,
				scale : [1, 1]
			},
			storage : {
				url : relative + 'plugins/AW_Etude/images/disk_storage.png',
				position : {x : 1, y : 1},
				rotation : 0,
				scale : [1, 1]
			},
			worker : {
				url : relative + 'plugins/AW_Etude/images/process.png',
				position : {x : 1, y : 1},
				rotation : 0,
				scale : [1, 1]
			},
			soft : {
				url : relative + 'plugins/AW_Etude/images/soft.png',
				position : {x : 1, y : 1},
				rotation : 0,
				scale : [1, 1]
			},
			com : {
				url : relative + 'plugins/AW_Etude/images/email_phone.png',
				position : {x : -1, y : 1},
				rotation : 0,
				scale : [1, 1]
			},
			user : {
				url : relative + 'plugins/AW_Etude/images/user.png',
				position : {x : 1, y : 1},
				rotation : 0,
				scale : [1, 1]
			},
			saisie : {
				url : relative + 'plugins/AW_Etude/images/saisie.png',
				position : {x : 1, y : 1},
				rotation : 0,
				scale : [1, 1]
			},
			multi : {
				url : relative + 'plugins/AW_Etude/images/multi.png',
				position : {x : 1, y : 1},
				rotation : 0,
				scale : [1, 1]
			},
			redac : {
				url : relative + 'plugins/AW_Etude/images/redac.png',
				position : {x : 1, y : 1},
				rotation : 0,
				scale : [1, 1]
			},
			prod : {
				url : relative + 'plugins/AW_Etude/images/prod.png',
				position : {x : 1, y : 1},
				rotation : 0,
				scale : [1, 1]
			},
			livraison : {
				url : relative + 'plugins/AW_Etude/images/livraison.png',
				position : {x : 1, y : 1},
				rotation : 0,
				scale : [1, 1]
			},
			presta : {
				url : relative + 'plugins/AW_Etude/images/presta.png',
				position : {x : 1, y : 1},
				rotation : 0,
				scale : [1, 1]
			},
			check : {
				url : relative + 'plugins/AW_Etude/images/check.png',
				position : {x : 1, y : 1},
				rotation : 0,
				scale : [1, 1]
			}
		},
		flowTaskHr : [
			['check' , 'Secteur Prédiffusion'],
			['redac' , 'Unité Prog.'], 
			['prod' , 'Direction Prod. Interne'],
			['presta' , 'Prestataire'],
			['multi' , 'Secteur Post-prod. Multi'],
			['livraison' , 'Livraison'],
			["com" , 'Com'],
			["user" , 'Action'],
			["saisie", "Saisie"],
			["soft" , 'App'],
			["worker" , 'Système'],
			["storage" , 'Stockage'],
			["warning" , 'Carrefour']
		],
		blockBgColor : [0xF2F2F2,//0xF1F1F1,
		                0xECECEC,//0xF7F7F7,
		                0xF1F1F1,
		                0xF2F2F2],
		bgLabels : ['G.E.I.E',
		            'Prédiffusion',
		            'Process',
		            'Hardware'],
		clockMode : {
			on : false,
			targetH_Interval : 0,
			gridOffset : 205,
			currentTitlePosition : {x : 5.5, y : 45.5},
			targetTitlePosition : {x : 0, y : -12},
			currentTitleRotation : 0,
			targetTitleRotation : - Math.PI / 4,
			targetBlockHeight : 51,
			durationBlockWidthFactor : 7.7 / 60
		}
}

WG.colorFromSubflow = function(subflow) {
	return this.options.defaultColors[subflow];
};

WG.iconFromSubTask = function(subTask, subflow) {
	if (typeof subTask === "undefined" || subTask.length === 0 && subflow) {
		return this.iconFromSubTask(subflow);
	}
	return this.options.icons[subTask];
};

/** _baseShape
 * @param [lineStyle] {[number, number(hex), number]}
 * @param [fillStyle] {[number(hex), number]}
 */
WG._baseShape = function(lineStyle, fillStyle) {
	lineStyle = lineStyle || [WG.options.defaultLineWidth, WG.options.itemBorderColor, 1];
	fillStyle = fillStyle || [WG.options.itemBgColor, 1];
	
	this.lineWidth = lineStyle[0] || WG.options.defaultLineWidth;
	this.lineColor = typeof lineStyle[1] === 'number' ? lineStyle[1] : WG.options.itemBorderColor;
	this.lineAlpha = typeof lineStyle[2] === 'number' ? lineStyle[2] : WG.options.defaultSplineAlpha;
	this.lineDash =  typeof lineStyle[3] === 'object' ? lineStyle[3] : [];
	this.fillColor = typeof fillStyle[0] === 'number' ? fillStyle[0] : WG.options.itemBgColor;
	this.fillAlpha = typeof fillStyle[1] === 'number' ? fillStyle[1] : 1;

	this._shape = new PIXI.Graphics();
	this.draw();
}

WG._baseShape.prototype.draw = function() {
	this._shape.lineStyle(this.lineWidth, this.lineColor, this.lineAlpha, this.lineDash);
}

WG._baseShape.prototype.clear = function () {
	this._shape.clear();
	this.draw();
}

/** _baseSprite
 * 
 */
WG._baseSprite = function(texture) {
	this._shape = new PIXI.extras.TilingSprite(texture);
}

WG._baseSprite.prototype.generateNew = function (texture) {
	this._shape.destroy();
	this._shape = new PIXI.extras.TilingSprite(texture);
}

/** _text
 * @param text {string}
 * @param font {[string, number, string]}
 * @param fill {number(hex)}
 * @param align {string}
 */
WG._text = function (text, font, fill, align, position, rotation) {
	font = font || [WG.options.defaultFontWeight, WG.options.defaultFontSize, WG.options.defaultFontFamily];
	this.rotation = rotation || 0;
	if (!this.position || typeof position === 'object') 
		this.position = position || {x : 0, y : 0};
	
	this.text = text || '';
	
	this.fontWeight = font[0] || WG.options.defaultFontWeight;
	this.fontSize = font[1] || WG.options.defaultFontSize;
	this.fontFamily = font[2] || WG.options.defaultFontFamily;
	this.lineHeight = font[3] || Number(font[1].slice(0, 2)) + 5;

	this.fill = typeof fill === 'number' ? fill : WG.options.defaultFontColor;
	this.align = typeof align === 'string' ? align : WG.options.defaultFontAlign;
	
	this.draw();
}

WG._text.prototype.draw = function() {
	
	this._text = new PIXI.Text(this.text, {
		font : this.fontWeight + ' ' + this.fontSize + ' ' + this.fontFamily,
		fill : this.fill,
		align : this.align,
		lineHeight : this.lineHeight
		}
	);
	this._text.position = this.position
	this._text.rotation = this.rotation
	this._text.scale = {x : .5, y : .5};
}

WG._text.prototype.reDraw = function () {
	this.draw();
}

/** _handleShape
 * @param subflow {string}
 * @param width {number}
 * @param height {number}
 */
WG._handleShape = function(subflow, width, height) {
	
	this.x = 0;
	this.y = 0;
	this.width =  width;

	this.height = height;
	this.borderRadius = 2;
	
	this.create(subflow);
	this.draw();
};

WG._handleShape.prototype.create = function(subflow) {
	
	this._baseShape = new WG._baseShape(
			[
		undefined, 
		graphUtils.darkerColor(WG.colorFromSubflow(subflow)),
		1],[
		graphUtils.lighterColor(WG.colorFromSubflow(subflow)),
		1
		]
	);
};

WG._handleShape.prototype.draw = function() {
	this._baseShape._shape.beginFill(this._baseShape.fillColor, 1);
	this._baseShape._shape.drawRoundedRect(this.x, this.y, this.width, this.height, this.borderRadius);
	this._baseShape._shape.endFill();
};

WG._handleShape.prototype.reDraw = function () {
	this._baseShape.clear();
	this.draw();
}

/** _splineShape
 * @param lineWidth {number}
 * @param color {number}
 */
WG._splineShape = function(lineWidth, color, lineAlpha, lineDash) {
	this._baseShape = new WG._baseShape([lineWidth, color, (typeof lineAlpha !== 'undefined' ? lineAlpha : WG.options.defaultSplineAlpha), lineDash]);
	this._baseShape._shape.__type = 'splineLink';
};

/** _largelinkShape
 * @param lineWidth {number}
 * @param color {number}
 */
WG._largeLinkShape = function(width, height) {
	this.index;
	this.dest = {x : 0, y : 0};
	
	this.width = width;
	this.height = height;
	
	var texture = PIXI.Texture.fromImage(relative + 'plugins/AW_Etude/images/chevrons.png');
	this._baseShape = new WG._baseSprite(texture);
	this.shape = this._baseShape._shape;
	this.shape.__type = 'largeLinkShape';
}

WG._largeLinkShape.prototype.update = function () {
	this.shape.width = this.width = this.dest.x + WG.options.defaultHandleWidth;
	this.shape.height = this.height - 4;
	this.shape.tilePosition.x = - this.width * 1.5;
	this.shape.tileScale.y = 2;
	this.shape.tint = 0xFFFFFF;
	this.shape.position = {
			x : 4,
			y : - this.parent.shape.position.y + 2
		};
	this.reDraw();
};

WG._largeLinkShape.prototype.reDraw = function () {
	this.shape.width = this.width = this.dest.x + WG.options.defaultHandleWidth;
	this.shape.height = this.parent.targetHandle.parent.height - 4;
	this.shape.position = {
			x : 4,
			y : - this.parent.shape.position.y + 2
		};
}

/** _boxingShape
 * @param width {number}
 * @param height {number}
 */
WG._boxingShape = function(width, height) {
	this.width = width;
	this.height = height;
	this.borderRadius = 2;
	
	this._baseShape = new WG._baseShape();
	this.shape = this._baseShape._shape;
	this.draw();
};

WG._boxingShape.prototype.draw = function () {
	this.shape.beginFill(this._baseShape.fillColor, this._baseShape.fillAlpha);
	this.shape.drawRoundedRect(this.x + .5, this.y + .5, this.width - 1, this.height - 1, this.borderRadius);
	this.shape.endFill();
};

/** _legendShape
 * @param width {number}
 * @param height {number}
 */
WG._legendShape = function(text) {
	this.text = text;
	
	this.fontWeight = undefined;
	this.fontSize = '24px';
	this.fontFamily = 'Roboto Condensed';
	
	this.color = 0x000000;
	this.align = 'center';
	this.position = {x : 0, y : 1};
	this.rotation = 0;
	
	this.width = graphUtils.stringWidthFromLength(text, this.fontFamily, '12px') + 2;
	this.height = 15;
};

WG._legendShape.prototype.draw = function () {
	var boxing = new WG._boxingShape(this.width, this.height);
	this.shape = boxing.shape;
	this._textShape = new WG._text(this.text, [this.fontWeight, this.fontSize, this.fontFamily], this.color, this.align, this.position, this.rotation)
	this.shape.addChild(this._textShape._text);
};

/** _fillBoxShape
 * @param subflow {subflow}
 * @param width {number}
 * @param height {number}
 */
WG._fillBoxShape = function(taskFlow, subflow, width, height, borderRadius, lineDash) {
	this.width = width;
	this.height = height;
	this.borderRadius = borderRadius;
	this.taskFlow = taskFlow;
	this.subflow = subflow;
	this.alpha = this.subflow === 'hypo' ? 0.12 : WG.options.defaultLineAlpha;
	this.lineDash = lineDash;
	
	this._baseShape = new WG._baseShape([undefined, undefined, undefined, this.lineDash], [WG.options.itemBgColor, this.alpha]);
//	this.shape = this._baseShape._shape;
};

WG._fillBoxShape.prototype.draw = function (breaker) {
	
	this.shape.lineStyle(this._baseShape.lineWidth, WG.options.itemBorderColor, 1, this._baseShape.lineDash);
	this.shape.beginFill(this._baseShape.fillColor, this._baseShape.fillAlpha);
	this.shape.drawRoundedRect(this.x + .5, this.y + .5, this.width - 1, this.height - 1, this.borderRadius);
	this.shape.endFill();
	
	if (!breaker) {
		this.shape.lineStyle(this._baseShape.lineWidth, WG.colorFromSubflow(this.subflow), 1);
		this.shape.moveTo(this._baseShape.lineWidth, this._baseShape.lineWidth + this.borderRadius);
		this.shape.lineTo(this._baseShape.lineWidth, this.height - this._baseShape.lineWidth - this.borderRadius);
		this.shape.moveTo(this.width - this._baseShape.lineWidth, this._baseShape.lineWidth + this.borderRadius);
		this.shape.lineTo(this.width - this._baseShape.lineWidth, this.height - this._baseShape.lineWidth - this.borderRadius);
	}
};

/** _borderBoxShape
 * @param width {number}
 * @param height {number}
 */
WG._borderBoxShape = function(width, height, borderRadius) {
	this.width = width;
	this.height = height;
	this.borderRadius = 2;
	
	this._baseShape = new WG._baseShape([WG.options.defaultLineWidth, 0, WG.options.defaultLineAlpha]);
//	this.shape = this._baseShape._shape;
};

WG._borderBoxShape.prototype.draw = function () {
	var halfWidth = Math.abs(Math.ceil(this.width / 2));
	var tensionOffset = 7;
	
	this.shape.beginFill(this._baseShape.fillColor, this._baseShape.fillAlpha);
	this.shape.drawRoundedRect(1.5, 1.5, this.width - 3, this.height - 3, this.borderRadius);
	this.shape.endFill();
	
	this.shape.moveTo(tensionOffset, 0);
	
	this.shape.lineStyle(this._baseShape.lineWidth, this._baseShape.lineColor, 1, this._baseShape.lineDash);
	this.shape.bezierCurveTo(0, 0, 0, 0, 0, tensionOffset);
	this.shape.lineTo(0, this.height - tensionOffset);
	this.shape.bezierCurveTo(0, this.height, 0, this.height, tensionOffset, this.height);
	
	this.shape.lineStyle(this._baseShape.lineWidth, this._baseShape.lineColor, .21, this._baseShape.lineDash);
	this.shape.lineTo(this.width - tensionOffset, this.height);
	
	this.shape.lineStyle(this._baseShape.lineWidth, this._baseShape.lineColor, 1, this._baseShape.lineDash);
	this.shape.bezierCurveTo(this.width, this.height, this.width, this.height, this.width, this.height - tensionOffset);
	this.shape.lineTo(this.width, tensionOffset);
	this.shape.bezierCurveTo(this.width, 0, this.width, 0, this.width - tensionOffset, 0);
	
	this.shape.lineStyle(this._baseShape.lineWidth, this._baseShape.lineColor, .21, this._baseShape.lineDash);
	this.shape.lineTo(tensionOffset, 0);
};

/** _boxShape
 * @param type {string}
 * @param width {number}
 * @param height {number}
 */
WG._boxShape = function(taskFlow, subflow, type, width, height) {
	this.type = type;
	this.taskFlow = taskFlow;
	this.subflow = subflow;
	this.lineDash = this.subflow === 'hypo' ? [7, 12] : [];
	this.borderRadius = 15;
	this.alpha = this.subflow === 'hypo' ? 0.12 : 1;
	
	this.x = 0;
	this.y = 0;
	this.width = width;
	this.height = height;
	this._baseShape = new WG._baseShape([undefined, undefined, .21, this.lineDash], [graphUtils.softerColor(WG.colorFromSubflow(this.subflow)), this.alpha]);
	this.draw();
};

WG._boxShape.prototype.draw = function () {
	switch (this.type) {
		case 'fill' :
			var fill = new WG._fillBoxShape(this.taskFlow, this.subflow, this.width, this.height, this.borderRadius, this.lineDash);
			fill.shape = this._baseShape._shape; 
			fill.draw();
			this.shape = fill.shape;
			break;
		case 'noBars' :
			var fill = new WG._fillBoxShape(this.taskFlow, this.subflow, this.width, this.height, this.borderRadius);
			fill._baseShape = this._baseShape;
			fill.shape = this._baseShape._shape;
			fill.draw('noBars');
			this.shape = fill.shape;
			break;
		case 'evolved' :
			var border = new WG._borderBoxShape(this.width, this.height);
			border._baseShape = this._baseShape;
			border._baseShape.fillColor = WG.options.itemBgColor;
			border._baseShape.lineColor = 0;
			border.shape = this._baseShape._shape;
			border.draw();
			this.shape = border.shape;
			break;
	}
};

WG._boxShape.prototype.clear = function () {
	this._baseShape.clear();
//	this._baseShape.draw(); // Already done in clear()
}

WG._boxShape.prototype.reDraw = function (width, height) {
	this.clear();
	this.width = width || this.parent.width;
	this.height = height || this.parent.height;

	if (this.parent.graph.options.clockMode.on === true) {
		this.borderRadius = 7;
		if (this.subFlow)
			this._baseShape.fillColor = graphUtils.softerColor(WG.colorFromSubflow(this.subflow));
		else
			this._baseShape.fillColor = 0xAAAAAA;
		if (this.type == 'fill') {
			this.type = 'noBars';
		}
	}
	else {
		this.borderRadius = 15;
//		this._baseShape.fillColor = WG.options.itemBgColor;
		if (this.type == 'noBars') {
			this.type = 'fill';
		}
	}
	this.draw();
}

/** Spline
 * @param subflow {string}
 * @param width {number}
 * @param height {number}
 */
WG.Spline = function(subflow, lengendOut, lengendIn, lineDash, thin, randomizedIndex) {
	this.subflow = subflow;
	this.lineWidth = thin === true ? 2 : ((subflow === 'reclam' || subflow === "redacReclam") ? WG.options.defaultBigSplineWidth : (subflow === 'worker' || subflow === 'storage' || subflow === 'soft' || subflow === 'warning' ? 3 : WG.options.defaultSplineWidth));
	this.color = WG.colorFromSubflow(subflow) || WG.options.defaultSplineColor;
//		? graphUtils.colorFromTable2Hexa(graphUtils._colorLookup[graphUtils._specialColorIndex[Math.floor(Math.min(randomizedIndex / 1.9, 7))]]) 
	this.lineDash = lineDash === true ? [12, 5] : [];
	this.alpha = subflow === 'reclam' ? .44 : (subflow === "redacReclam" ? .12 : WG.options.defaultSplineAlpha);

	this.index;
	this.randomOffset;

	this.dest;
	
	this.textOut = lengendOut;
	this.textIn = lengendIn;
	
	this.lengendOut;
	this.lengendIn;

	this._splineShape = new WG._splineShape(this.lineWidth, this.color, this.alpha, this.lineDash);
	this.shape = this._splineShape._baseShape._shape;
};


WG.Spline.prototype.update = function(innerLink) {
	this.randomOffset = WG.options.randomOffsets[this.parent.parent.randomizedIndex % 10];

	// tension offset is the length of the curved section : get the sign of y to know if we should go up or down
	this.tensionOffset = {x : WG.options.defaultTensionOffset, y : WG.options.defaultTensionOffset * Math.ceil(this.dest.y / Math.abs(this.dest.y || 1)) * (this.dest.y < 24 ? .5 : 1)};
	
	// lengthConst is the distance we have to substract to the total distance to get the turning point
	this.lengthConst = (this.parent.parent.graph.options.defaultH_Interval / 2.2) + this.tensionOffset.x;
	
	this.antiOver = Math.floor(-this.parent.index * 5 - this.index * 5 + this.randomOffset);

	this.position = {
			x : this.parent.parent.graph.options.defaultHandleWidth,
			y : Math.floor((this.index + 1) * this.parent.height / (this.parent.splines.length + 1))
		};
	
//	if (innerLink)
//		console.log(this.position);
	this.shape.position = this.position;
	
	if (this.parent.feedback)
		this.drawFeedback();
	else
		this.draw();
	this.addLegends();
};

WG.Spline.prototype.draw = function() {
	
	var turningPoint = {x : this.dest.x - this.lengthConst + this.antiOver, y : 0};
	this.shape.lineStyle(this.lineWidth, this.color, this._splineShape._baseShape.lineAlpha, this.lineDash);
	this.shape.moveTo(0,0);
	this.shape.lineTo(turningPoint.x, 0);
	this.shape.bezierCurveTo(turningPoint.x + this.tensionOffset.x, 0, turningPoint.x + this.tensionOffset.x, 0, turningPoint.x + this.tensionOffset.x, this.tensionOffset.y);
	this.shape.lineTo(turningPoint.x + this.tensionOffset.x, this.dest.y - this.tensionOffset.y);
	this.shape.bezierCurveTo(turningPoint.x + this.tensionOffset.x, this.dest.y, turningPoint.x + this.tensionOffset.x, this.dest.y, turningPoint.x + this.tensionOffset.x * 2, this.dest.y);
	this.shape.lineTo(this.dest.x, this.dest.y);
};

WG.Spline.prototype.drawFeedback = function() {
	
	var tensionOffset = {x : 15, y : 15};
	var turningPoint = {x : this.parent.parent.graph.options.defaultH_Interval - this.lengthConst + this.antiOver, y : 0};
	var altitude = - (Math.max(0, this.parent.parent.graph.grid.rows[this.parent.parent.gridHook.y] - this.parent.parent.graph.grid.rows[this.parent.target.gridHook.y]))
		- this.parent.shape.position.y -this.parent.height / 2 - this.parent.parent.graph.options.defaultV_Interval - this.antiOver / 2;
	this.shape.lineStyle(this.lineWidth, this.color, this.alpha);//, [12, 7]);
	this.shape.moveTo(0,0);
	this.shape.lineTo(turningPoint.x, 0);
	
	this.shape.bezierCurveTo(turningPoint.x + tensionOffset.x, 0, turningPoint.x + tensionOffset.x, 0, turningPoint.x + tensionOffset.x, - tensionOffset.y);
	this.shape.lineTo(turningPoint.x + tensionOffset.x, altitude + tensionOffset.y);
	
	this.shape.bezierCurveTo(turningPoint.x + tensionOffset.x, altitude, turningPoint.x + tensionOffset.x, altitude, turningPoint.x, altitude);
	this.shape.lineTo(this.dest.x - this.lengthConst + tensionOffset.x * 2, altitude);
	
	this.shape.bezierCurveTo(this.dest.x - this.lengthConst + tensionOffset.x + this.antiOver, altitude, this.dest.x - this.lengthConst + tensionOffset.x + this.antiOver, altitude, this.dest.x - this.lengthConst + tensionOffset.x + this.antiOver, altitude + tensionOffset.y);
	this.shape.lineTo(this.dest.x - this.lengthConst + tensionOffset.x + this.antiOver, this.dest.y - tensionOffset.y);
	
	this.shape.bezierCurveTo(this.dest.x - this.lengthConst + tensionOffset.x + this.antiOver, this.dest.y, this.dest.x - this.lengthConst + tensionOffset.x + this.antiOver, this.dest.y, this.dest.x - this.lengthConst  + tensionOffset.x * 2 + this.antiOver, this.dest.y);
	this.shape.lineTo(this.dest.x - 14, this.dest.y);
	this.shape.drawPolygon([this.dest.x - 9, this.dest.y - 2, this.dest.x - 5, this.dest.y, this.dest.x - 9, this.dest.y + 2, this.dest.x - 9, this.dest.y - 2]);
};

WG.Spline.prototype.addLegends = function() {
	this.lengendOut = new WG._legendShape(this.textOut);
	if (this.lengendOut.width > 5) {
		this.lengendOut.draw();
		this.lengendOut.shape.position = {x : 1, y : - 15};
		this.shape.addChild(this.lengendOut.shape);
	}
	
	this.lengendIn = new WG._legendShape(this.textIn);
	if (this.lengendIn.width > 5) {
		this.lengendIn.draw();
		this.lengendIn.shape.position = {x : this.dest.x - this.lengendIn.width - .5, y : this.dest.y - 15};
		this.shape.addChild(this.lengendIn.shape);
	}
};

WG.Spline.prototype.reDraw = function() {
	for (var i = 0; i < this.shape.children.length; i++) {
		this.shape.removeChildAt(i);
	}
	delete this.lengendOut;
	delete this.lengendIn;
	this.shape.clear();
	this.update();
};

/** Handle
 * @param subflow {string}
 * @param index {number}
 * @param linkNbr {number}
 * @param total {number}
 */
WG.Handle = function(subflow, index, linkNbr, total, handleOffset) {
	this.subflow = subflow;
	this.index = index || 0;
	this.linksNbr = linkNbr || 1;
	this.total = total || 1;
	this.handleOffset = handleOffset || 0;
	
	this.width =  WG.options.defaultHandleWidth;
	this.height = this.linksNbr > 3 ? 101 : (this.linksNbr <= 2 ? WG.options.defaultHandleHeight / 1.77 : WG.options.defaultHandleHeight);
	
	this.target;
	this.targetHandle;
	this.reference;
	this.innerTarget;
	this.targetPosition = {x : 0, y : 0};
	this.innerTargetPosition = {x : 0, y : 0};

	this.splines = [];
	
	this._handleShape = new WG._handleShape(this.subflow, this.width, this.height);
	
	this.shape = this._handleShape._baseShape._shape;
	this.shape.__type = '_handleShape';
};

WG.Handle.prototype.updateTarget = function (skipPositioning) {

	// InnerLink
	if (skipPositioning && this.reference.innerTarget && this.reference.innerTarget.target != -1) {
		this.innerTarget = this.reference.innerTarget;
		this.target = this.parent.superBox.graph.objectList.boxes[this.innerTarget.target];
		this.subflow = this.innerTarget.subflow || 'warning';

//		console.error(this.target.handlesIn.length);
		this.target.addHandleIn(this.reference.parent.__id, 'special', this.target.handlesIn.length, this.innerTarget.versions.length, this.target.handlesIn.length);
		this.targetHandle = this.target.handlesIn[this.target.handlesIn.length - 1];
		this.targetHandle.reference = this;
		this.targetHandle.setPosition('In');
		this.setInnerTargetPosition();

		for (var i = 0; i < this.innerTarget.versions.length; i++) {
			this.addSpline(i, this.innerTarget.versions[i].legendOut, this.innerTarget.versions[i].legendOut, true, undefined, true);
			this.splines[i].dest = this.innerTargetPosition;
			this.splines[i].parent = this;
			this.splines[i].update('innerLink_debug');
			this.splines[i].shape.alpha = 0;
//			console.log(this.splines[i].position);
		};
		this.parent.shape.setChildIndex(this.shape, 1);
		this.parent.innerLink = this.splines;

	}
	else if (!skipPositioning) {
		this.targetHandle = this.target.handlesIn[this.target.handlesIn.length - 1];
		this.targetHandle.reference = this;
		this.setPosition('Out');
		this.targetHandle.setPosition('In');
		this.setTargetPosition();
		
		// largeLink
		if (this.shape.graphicsData[0].lineAlpha == 0) {
			this.targetHandle.shape.graphicsData[0].lineAlpha = this.targetHandle.shape.graphicsData[0].fillAlpha = 0;
			// Fake largeLink
			if (this.target.gridHook.y !== this.parent.gridHook.y)
				this.splines[0].shape.alpha = 0;
		}
	}
}

WG.Handle.prototype.setPosition = function(inOut) {
	var side, hack = 0, x, y;
	
	if (inOut == 'In') {
		side = 0;
		hack = this.parent.receivedLinksHack;
	}
	else {
		side = this.parent.width;
		hack = this.parent.emittedLinksHack;
	}

	this.shape.position.x = side - this.width / 2;
	this.shape.position.y = (typeof this.reference === 'object' && this.reference.parent.external === true && this.parent.external !== true)
		? 24
		: Math.ceil(Math.min((this.index + 1) * this.parent.height / (this.total + hack + 1) - this.height / 2 + this.handleOffset, this.parent.height - this.height - 15 * (Math.abs(hack) + 1)));

	// Animate Alpha
	if (this.shape.graphicsData[0].lineAlpha !== 0)
		this.shape.alpha = this.parent.graph.options.variableAlpha;

}

WG.Handle.prototype.setTargetPosition = function() {
	this.targetPosition.x = this.target.position.x - this.parent.position.x - (this.parent.width + this.parent.graph.options.defaultHandleWidth);
	this.targetPosition.y = this.target.position.y - this.parent.position.y + this.targetHandle.shape.position.y - this.shape.position.y
	if (this.targetPosition.y > -12 && this.targetPosition.y < 12)
		this.targetPosition.y = 0;
};

WG.Handle.prototype.setInnerTargetPosition = function() {	
	this.innerTargetPosition.x = (this.targetHandle.parent.position.x - this.targetHandle.parent.graph.options.defaultHandleWidth / 2 + this.targetHandle.parent.graph.objectList.subContainer.position.x);
	this.innerTargetPosition.y = (this.targetHandle.parent.position.y - this.shape.position.y + this.targetHandle.shape.position.y + this.targetHandle.parent.graph.objectList.subContainer.position.y);
	if (this.innerTargetPosition.y > -12 && this.innerTargetPosition.y < 12)
		this.innerTargetPosition.y = 0;
};

WG.Handle.prototype.addSpline = function (index, lengendOut, lengendIn, lineDash, largeLink, thin) {
	if (largeLink === true) {
		var s = new WG._largeLinkShape(this.parent.width, this.parent.height);
		s.parent = this;
		s.index = this.index;
		this.shape.graphicsData[0].lineAlpha = this.shape.graphicsData[0].fillAlpha = 0;
	}
	else {
		var s = new WG.Spline(this.subflow, lengendOut, lengendIn, lineDash, thin, WG.options.randomOffsets[this.parent.randomizedIndex % 10]);
		s.parent = this;
		s.index = index;
	}
	
	this.splines.push(s);
	this.shape.addChild(s.shape);
};

WG.Handle.prototype.updateSpline = function (index) {
	this.splines[index].dest = this.targetPosition;
	this.splines[index].update();
};


/** Box
 * @param type {string} super || undefined
 * @param title {string}
 * @param subTitle {string}
 * @param content {string}
 * @param subflow {string}
 * @param subTask {string}
 * @param external {boolean}
 * @param [hacks] {[number, number]}
 * @param superBox {boolean}
 */
WG.Box = function(graph, height, id, title, subTitle, content, subflow, subTask, external, gridHook, offset, hacks, duration, superBox) {
	var self = this;
	this.shape = new PIXI.Container();
	
	this.subflow = subflow;
	this.subTask = subTask;
	
	this.graph = graph;
	
	this.width = this.graph.defaultBoxDef.width;
	this.height = (external === true)
				? height / 2
				: height;
	
	this.savedWidth = parseInt(this.width);
	this.savedHeight = parseInt(this.height);

	// Automatically add 2 to height when set from outside
	Object.defineProperty(this, "newHeight", {
		set : function (newHeight) {
				this.height = newHeight + (this.superBox.resting !== true ? 5 + this.graph.options.defaultV_Interval : 0);
		}
	});
	// Automatically add 4 to width when set from outside
	Object.defineProperty(this, "newWidth", {
		set : function (newWidth) {
				this.width = newWidth;
		}
	});
	
	this.boxType = 'fill';
//	if (this.graph.__type === 'topGraph' || this.graph.__type === 'superGraph') 	// will be done in the graph builder
//		boxType = 'evolved';
	
	this.randomizedIndex = parseInt(this.graph.randomizeCounter); // make it unique
	this.gridHook = gridHook;
	this.offset = offset;
	this.external = external;
	this.emittedLinksHack = hacks[0];
	this.receivedLinksHack = hacks[1];
	this.duration = duration;
	this.indexAsATarget;
	this.placed = false;

	this.superBox = {height : this.height, developped : false};
	this.handlesIn = [];
	this.handlesOut = [];
	
	// Set missing Grid Indexes
	this.fullFillGrid();

	// Automatically position the box when receiving a reference
	Object.defineProperty(this, "reference", {
		set : function (reference) {
				this.ref = reference[0];
				this.indexAsATarget = reference[1];
				this.getPositionFromRef();
				this.completeBoxDefFromRef();
		}
	});
	
	// Automatically inverse handles when setting the property
	Object.defineProperty(this, "reverseHandlesOut", {
		set : function (reverseHandles) {
				if (reverseHandles !== true)
					return;
				
				for (var n = 0; n < this.handlesOut.length; n++) {
					this.handlesOut[n].index = this.handlesOut.length - n - 1;
					this.shape.setChildIndex(this.handlesOut[n].shape, this.handlesOut.length - n + 1);
				}
		}
	});
	Object.defineProperty(this, "reverseHandlesIn", {
		set : function (reverseHandles) {
				if (reverseHandles !== true)
					return;
				
				for (var n = 0; n < this.handlesIn.length; n++) {
					this.handlesIn[n].index = this.handlesIn.length - n - 1;
				}
				$.each(this.handlesIn, function(key, handle) {
					handle.setPosition('In');
					handle.reference.setTargetPosition();
					$.each(handle.reference.splines, function(i, s) {
						s.dest = handle.reference.targetPosition
						s.reDraw();
					});
				});
		}
	});
	
	this._boxShape = new WG._boxShape(this.subTask || this.subflow, this.subflow, this.boxType, this.width, this.height);
	this._boxShape.parent = this;
	this._boxShape.shape.__type = '_boxShape';
	
	this.position = {x : this.graph.options.graphStartingPoint.x, y : this.graph.grid.rows[this.gridHook.y]};
	this.shape.position = this.position;
	
	this.titleContainer = new PIXI.Container();
	this.icon = new PIXI.Sprite();
	this.expandableIcon = new PIXI.Sprite();
	this.addTitles(title.toUpperCase(), subTitle, content);
	this.title = this.titleContainer;
	
	this.__title = this.shape.__title = title.replace(/\n/g, ' ');
	this.__id = this.shape.__id = id;
	
	this.shape.addChild(this._boxShape.shape);
	this.shape.addChild(this.icon);
	this.shape.addChild(this.titleContainer);
	this.shape.addChild(this.expandableIcon);
	this.graph.objectList.subContainer.addChild(this.shape);
}

WG.Box.prototype.reDraw = function (width, height) {
	var self = this;
	this.width = width || this.width;
	this.height = height || this.height;

	this._boxShape.reDraw();
	
	// box positionning : forward or reverse
	if (this.backwardReference === true) {
		this.getPositionFromTarget(0);
	}
	else if (typeof this.ref === 'object') {
		this.getPositionFromRef();
	}
	
	$.each(this.handlesIn, function(key, handle) {
		handle.setPosition('In');
		handle.reference.setPosition('Out');
		if (handle.reference.parent.backwardReference === true)
			handle.reference.parent.getPositionFromTarget(handle.reference.index);
		else if (typeof handle.reference.parent.ref === 'object') {
			handle.reference.parent.getPositionFromRef();
		}
		handle.reference.setTargetPosition();
		$.each(handle.reference.splines, function(k, spline) {
			spline.dest = handle.reference.targetPosition;
			spline.reDraw();
		});

		if (typeof handle.reference.innerTarget !== 'undefined' && self.superBox.graph) {
			if (!self.innerLink)
				handle.updateTarget('skip');
			handle.setInnerTargetPosition();
			$.each(handle.splines, function(k, spline) {
				spline.dest = handle.innerTargetPosition;
				spline.reDraw();
			});
		}
	});
	
	this.titleContainer.rotation = this.graph.options.clockMode.currentTitleRotation;
//	this.icon.alpha = Math.max(this.graph.options.variableAlpha, 0) + .5;
	if (this.graph.options.clockMode.on === true)
		this.icon.position = {x : 2, y : 21};
	else
		this.icon.position = {x : (this.icon.align.x == 1 ? 4.5 : this.width - 44 ), y : (this.icon.align.y == 1 ? 2 : this.height - 51)};
}

WG.Box.prototype.addTitles = function(title, subTitle, content) {
	var text, lineReturnNbr, subPosition, contentPosition;
	
	var image = WG.iconFromSubTask(this.subTask, this.subflow);
	if (typeof image !== "undefined") {
		var texture = PIXI.Texture.fromImage(image.url);
		this.icon.texture = texture;
		this.icon.position = {x : (image.position.x == 1 ? 4.5 : this.width - 44 ), y : (image.position.y == 1 ? 2 : this.height - 51)};
		this.icon.align = image.position;
		this.icon.width = 38 * image.scale[0];
		this.icon.height = 44 * image.scale[1];
		this.icon.rotation = image.rotation;
		this.icon.__type = 'icon';
	}
	else {
		this.icon.__type = 'emptyIcon';
		this.icon.align = {x : 1, y : 1};
	}

	text = new WG._text(title, [400, '29px', 'Open Sans CB'], [0x000000, 1], 'center', {x : 0, y : 0});
	text._text.textOneLine = title.replace(/\n/g, ' - ');
	text._text.textOriginal = title;
	this.titleContainer.addChild(text._text);
	
	if (title.length !== 0 && title.match(/\n/) !== null) subPosition =  {x : 0, y : title.match(/\n/g).length * 18 + 15};
	else if (subTitle.length !== 0)
		subPosition = {x : 0, y : 15};
	else
		subPosition = {x : 0, y : 0};
	text =  new WG._text(subTitle, [400, '25px', 'Roboto Condensed'], [0x777777, 1], 'center', subPosition);
	this.titleContainer.addChild(text._text);
	
	if (subTitle.length !== 0 && subTitle.match(/\n/) !== null) contentPosition =  {x : 0.5, y : subPosition.y + subTitle.match(/\n/g).length * 15 + 29};
	else contentPosition = {x : 0.5, y : subPosition.y + 15};
	text = new WG._text(content, [400, '28px', 'Roboto Condensed'], [0x555555, 1], 'center', contentPosition);
	text._text.textOneLine = content.replace(/\n/g, ' - ');
	text._text.textOriginal = content;
	this.titleContainer.addChild(text._text);
	
	this.titleContainer.position = this.graph.options.clockMode.currentTitlePosition;
	this.titleContainer.__type = 'titleContainer';
}

WG.Box.prototype.addHandleIn = function(referenceId, subflow, index, linksNbr, total) {
	var h = new WG.Handle(undefined, index, linksNbr, total)
	h.parent = this;
	h.referenceId = referenceId;
	h.linksNbr = linksNbr;
	this.handlesIn.push(h);
	this.shape.addChild(h.shape)
		
	if (this.graph.options.debugMode === true) {
		console.log("%c %s %c %s %c %s %c %o %c %s %c %d %c %s %c %s", 'color:#555555', '  ->  ' + (this.__title || this.__id), 'color: IndianRed', 'createHandleIn', 'color: RoyalBlue', 'this.handlesIn :', 'color: LimeGreen', this.handlesIn, 'color: RoyalBlue', 'total :', 'color: LimeGreen', total, 'color: RoyalBlue', 'subflow :', 'color: #555555', subflow);
	}
};

WG.Box.prototype.addHandleOut = function(targetId, subflow, index, linksNbr, total, handleOffset) {
	var h = new WG.Handle(subflow, index, linksNbr, total, handleOffset);
	h.parent = this;
	h.targetId = targetId;
	h.linksNbr = linksNbr;
	this.handlesOut.push(h);
	this.shape.addChild(h.shape)
};

WG.Box.prototype.getAbsolutePosition = function () {
	this.position = {
			x : (this.graph.grid.cols[this.gridHook.x] || ((this.offset.x) * (this.width + this.graph.options.defaultH_Interval))) || 0,
			y : ((this.graph.grid.rows[this.gridHook.y] || this.graph.grid.rows[0]) + (this.offset.y ? this.offset.y * (this.height + this.graph.options.defaultV_Interval * 2) : 0)) || 0
	};
	this.shape.position = this.position;
	
	if (this.graph.__type === 'topGraph' || this.graph.__type === 'superGraph') {
		this.updateGrid();
	}
}

WG.Box.prototype.completeBoxDefFromAbs = function() {
	if (this.gridHook.x === false)
		this.gridHook.x = Math.round(this.offset.x);
	if (!this.graph.grid.colsRef[this.gridHook.x])
		this.graph.grid.colsRef[this.gridHook.x] = this.width;
	this.gridHook.y =  this.gridHook.y !== false ? this.gridHook.y : 0;
//	this.placed = true;
	
	// Grid Update
	this.graph.grid.usedRows[this.gridHook.y] = true;
	this.fullFillGrid();
	
	if (this.graph.options.debugMode === true) {
		console.log("%c %s %c %s %c %s %c %d %c %s %c %d %c %s %c %d %c %s %o", 'color:#555555', '  ->  ' + (this.__title || this.__id), 'color: IndianRed', 'getAbsolutePosition', 'color: RoyalBlue', 'this.row :', 'color: LimeGreen', this.gridHook.y, 'color: RoyalBlue', 'row.y :', 'color: LimeGreen', this.graph.grid.rows[this.gridHook.y], 'color: RoyalBlue', 'this.col :', 'color: LimeGreen', this.gridHook.x, 'color: RoyalBlue', 'this.position :', this.position);
	}
};

WG.Box.prototype.getPositionFromRef = function () {
//	var xPose = (this.offset.x + 1) * ((this.ref.width + this.width) / 2 + this.graph.options.defaultH_Interval);
	var xPose = (this.offset.x + 1) * (this.ref.width + this.graph.options.defaultH_Interval);

	this.position = {
			x : (this.graph.options.clockMode.on !== true ? this.graph.grid.cols[this.gridHook.x] || (this.ref.position.x + xPose) : (this.ref.position.x + xPose)) || 0,
			y : ((this.external === true ? this.graph.grid.rows[0] : (this.graph.grid.rows[this.gridHook.y] || this.ref.position.y)) + (this.offset.y ? this.offset.y * (this.ref.height + this.graph.options.defaultV_Interval * 2) : 0) + ((this.ref.external !== true && this.gridHook.y === false) ? this.indexAsATarget * (this.height + this.graph.options.defaultV_Interval * 2) : 0)) || 0
	};
	this.shape.position = this.position;
//	if (this.__id === 'G2')
//		console.log(this.ref.position.x, xPose, this.position.x);
	if ((this.graph.__type === 'topGraph' || this.graph.__type === 'superGraph') && this.handlesIn.length > 0) // trick to know if all is constructed 
		this.updateGrid();
};

WG.Box.prototype.completeBoxDefFromRef = function() {
	this.gridHook.x = this.gridHook.x !== false ? this.gridHook.x : this.ref.gridHook.x + this.offset.x + 1;
	this.gridHook.y = this.gridHook.y !== false ? this.gridHook.y : (this.external === true ? 0 : this.ref.gridHook.y + this.indexAsATarget);
	this.placed = true;
	
	// Grid Update
	this.graph.grid.usedRows[this.gridHook.y] = true;
	if (!this.graph.grid.rowsRef[this.gridHook.y] || !this.graph.grid.colsRef[this.gridHook.x])
		this.fullFillGrid()

	if (this.graph.options.debugMode === true) {
		console.log("%c %s %c %s %c %s %c %d %c %s %c %d %c %s %c %d %c %s %o %c %s %o %c %s", 'color:#555555', '  ->  ' + (this.__title || this.__id), 'color: IndianRed', 'getPositionFromRef', 'color: RoyalBlue', 'this.row :', 'color: LimeGreen', this.gridHook.y, 'color: RoyalBlue', 'row.y :', 'color: LimeGreen', this.graph.grid.rows[this.ref.gridHook.y], 'color: RoyalBlue', 'this.col :', 'color: LimeGreen', this.gridHook.x, 'color: RoyalBlue', 'this.ref.position :', this.ref.position, 'color: RoyalBlue', 'this.position :', this.position, 'color:#555555', 'Ref :', this.ref.__id);
	}
};

WG.Box.prototype.getPositionFromTarget = function(index) {
	var target = this.handlesOut[index].target;
	var xPose = (this.offset.x + 1) * ((this.width) + this.graph.options.defaultH_Interval);
	
	this.position.x = (this.graph.options.clockMode.on !== true ? this.graph.grid.cols[this.gridHook.x] || target.position.x - xPose : target.position.x - xPose) || 0;
	this.position.y = ((this.external === true) 
		? this.graph.grid.rows[0]
		: (this.graph.grid.rows[this.gridHook.y] || target.position.y) + (this.offset.y) * (this.height + this.graph.options.defaultH_Interval)
		) || 0;
	this.shape.position = this.position;
//	if (this.__id === 'G1')
//		console.log(this.__id, target.position.x, xPose, this.position.x);
	if ((this.graph.__type === 'topGraph' || this.graph.__type === 'superGraph') && this.handlesIn.length > 0) // trick to know if all is constructed 
		this.updateGrid();
};

WG.Box.prototype.completeBoxDefFromTarget = function(index) {
	var target = this.handlesOut[index].target;
	this.gridHook.x = this.gridHook.x !== false ? this.gridHook.x : target.gridHook.x - this.offset.x - 1;
	this.gridHook.y = this.gridHook.y !== false ? this.gridHook.y : (this.external === true ? 0 : target.gridHook.y);
	this.placed = true;

	// Grid Update
	this.graph.grid.usedRows[this.gridHook.y] = true;
	if (!this.graph.grid.rowsRef[this.gridHook.y] || !this.graph.grid.colsRef[this.gridHook.x]) 	// Should be very rare 
		this.fullFillGrid()																		// (only in case of a target positionning for a block set to stick at a lower position than ever set)
	
	if (this.graph.options.debugMode === true) {
		console.log("%c %s %c %s %c %s %c %d %c %s %c %d %c %s %c %d %c %s %o %c %s %o %c %s", 'color:#555555', '  ->  ' + (this.__title || this.__id), 'color: IndianRed', 'getPositionFromTarget', 'color: RoyalBlue', 'target.row :', 'color: LimeGreen', target.gridHook.y, 'color: RoyalBlue', 'target.col :', 'color: LimeGreen', target.gridHook.x, 'color: RoyalBlue', 'row.y :', 'color: LimeGreen', this.graph.grid.rows[target.gridHook.y], 'color: RoyalBlue', 'target.position', target.position, 'color: RoyalBlue', 'this.position :', this.position, 'color:#555555', 'target :', target.__title);
	}
};

WG.Box.prototype.fullFillGrid = function() {
	if (this.gridHook.y !== false || this.gridHook.x !== false) {
		if (!this.graph.grid.rowsRef[this.gridHook.y] && this.gridHook.x !== 0) { 	// first box can be bigger without influence on the grid
			for (var i = 0; i <= this.gridHook.y; i++) {
				if (!this.graph.grid.rowsRef[i])
					this.graph.grid.rowsRef[i] = this.height;
			}
		}
		if (!this.graph.grid.colsRef[this.gridHook.x]) {
			for (var i = 0; i <= this.gridHook.x; i++) {
				if (!this.graph.grid.colsRef[i])
					this.graph.grid.colsRef[i] = this.width;
			}
			if (this.graph.__type === 'topGraph')
				this.graph.grid.colsRef[0] = 0;
		}
		this.graph.generateGrid(Math.min(this.gridHook.y || 1, this.gridHook.x || 1));
	}
}

WG.Box.prototype.updateGrid = function() {
	var shallReturn = false, self = this;

	if ((this.superBox.expanding === true && this.height > this.graph.grid.rowsRef[this.gridHook.y]) 
			|| (this.superBox.resting === true && this.height < this.graph.grid.rowsRef[this.gridHook.y])) {
		this.graph.grid.rowsRef[this.gridHook.y] = Math.ceil(this.height) - 2;
		this.graph.generateGrid(this.gridHook.y);
	}
	if (this.superBox.expanding === true && this.width > this.graph.grid.colsRef[this.gridHook.x]) {
		this.graph.grid.colsRef[this.gridHook.x] = Math.ceil(this.width) - 2;
		this.graph.generateGrid(this.gridHook.x);
	}
	
	if (this.superBox.resting === true) {
		// Check if there is a risk of pulling a box over another larger and developped superBox
		$.each(this.handlesOut, function(key, handle) {
			$.each(handle.target.handlesIn, function(k, h) {
				if (self !== h.reference.parent && h.reference.parent.superBox.developped === true && h.reference.parent.width > self.width) {
					self.graph.grid.colsRef[self.gridHook.x] = Math.ceil(h.reference.parent.width) - 2;
					self.graph.generateGrid(self.gridHook.x);
					shallReturn = true;
					return false;
				}
			});
		});
		if (shallReturn === true)
			return;
	
		if (this.width < this.graph.grid.colsRef[this.gridHook.x]) {
			this.graph.grid.colsRef[this.gridHook.x] = Math.ceil(this.width) - 2;
			this.graph.generateGrid(this.gridHook.x);
		}
	}
}

//var test = new WG.Box(undefined, "Titre", "subTitle", "content", "process");
