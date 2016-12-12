var chartviewer = function() {}

//chartviewer.baseDataRequestCache = undefined;

chartviewer.loadBaseData = function (id) {
	
	if (typeof WG.baseDataRequestCache === 'undefined') {
		WG.baseDataRequestCache = $.ajax({
			type : 'GET',
			url : './datasets/liste_enrichie2.json',
			processData : false,
			dataType : 'text',
			beforeSend: function(jqXHR, settings) {
		        jqXHR.url = settings.url;
		        jqXHR.id = id;
		    }
		})
		.fail(function(jqxhr, settings, exception) {
			console.log(jqxhr, settings, exception);
		});
	}

	return WG.baseDataRequestCache; 
}

chartviewer.setbaseDef = function() { 	// not used
	if (typeof chartviewer.baseDataRequestCache === 'string') {
		this.baseData = chartviewer.baseDataRequestCache;
		this.populateTableOfContents();
	}
	else {
		chartviewer.baseDataRequestCache.done(function(data) {
			self.baseData = data;
			self.populateTableOfContents();
		});
	}
};

chartviewer.populateTableOfContents = function() {
	var self = this;
	
	
	this.uniqueGraph = (window.location.href.match(/num/) !== null ? window.location.href.match(/num=([^&]*)/)[1] : false);
	
	this.loadBaseData().done(function(data) {
		WG.baseDataRequestCache = data;
		
		self.listRequest = $.ajax({
			type : 'get',
			url : './listCharts.php',
			data : {result : true, folder : './chartConstructors/'}
		}).done(function(data) {
			
			$('<div/>', {'class' : 'sommaire'}).append(
					$('<div/>', {'class' : 'sommaire_titre'}).html('Table des Matières'),
					$('<ul/>')
				).appendTo('body');
			var container = $('.sommaire ul');
			
			$('.sommaire').on('mouseenter mouseleave', function(e) {
				if (!this.opened) {
					$(this).animate({'left' : '-15px'}, {duration : 255, ease : 'easeOutExpo'});
					this.opened = true;
				}
				else {
					$(this).animate({'left' : '-289px'}, {duration : 255, ease : 'easeOutExpo'});
					this.opened = false;
				}
			});
			
			var chartList = JSON.parse(data);
			var dataArray = $.makeArray(chartList), key, value;
			dataArray.sort(self.sortById);
			
			if (self.uniqueGraph) {
				var graphToLoad = Object.keys(dataArray[self.uniqueGraph])[0];
			}

			for (var k = 0, l = dataArray.length; k < l; k++) {
				key = Object.keys(dataArray[k]);
				value = dataArray[k][key[0]];
				
				(function(k, key, value) {
					var filename = value.match(/Id(\d{3})_(.*)\.js/);
					var id = key[0];
					
					var link = $('<li/>', {'class':'sommaire_lien'}).html('&nbsp;' + filename[1] + '&nbsp;' + filename[2]).appendTo(container);

					statisticsChart.requestCache[id] = $.getScript('./chartConstructors/' + value).done(function() {
						link.click(function(e) {
							stage.removeChildren();
							self.showChart(id);
						});

						if (graphToLoad && id === graphToLoad)
							self.showChart(id);
						else if (typeof graphToLoad === 'undefined' && k === 0)
							self.showChart(id);
						
					}).fail(function(jqxhr, settings, exception) {
						console.log(jqxhr, settings, exception);
					});
				})(k, key, value);
			}
		})
		.fail(function(jqxhr, settings, exception) {
			console.log(jqxhr, settings, exception);
		});
	});
	
	
	// Avoid memory leak
	window.onbeforeunload = function (e) {
		self.baseDataRequestCache = null;
		delete self.baseDataRequestCache;
	}

//	$('.sommaire').on('mouseenter mouseleave', function(e) {
//		if (!this.opened) {
//			$(this).animate({'left' : '-15px'}, {duration : 255, ease : 'easeOutExpo'});
//			this.opened = true;
//		}
//		else {
//			$(this).animate({'left' : '-289px'}, {duration : 255, ease : 'easeOutExpo'});
//			this.opened = false;
//		}
//	});
};

chartviewer.showChart = function(id) {
	
	stage.removeChildren();
	this.chart = new statisticsChart();
	this.chart.setOnLoaded(statisticsChart.requestCache[id].initiator);
	this.chart.setAsyncBaseData = WG.baseDataRequestCache;

};

chartviewer.sortById = function(a, b){
	var j = Object.keys(a)[0].toLowerCase();
	var k = Object.keys(b)[0].toLowerCase();
	return ((j < k) ? -1 : ((j > k) ? 1 : 0));
}

var statisticsChart = function(options) {
	var self = this;
	this.init(options);
	
	Object.defineProperty(this, "setAsyncBaseData", {
		set : function (graphDefLoadingDeferred) {
			
			$.when(graphDefLoadingDeferred).done(function(data) {
				if (!(data instanceof Object)) {
					WG.baseDataRequestCache = JSON.parse(data);
				}
				self.graphData = self.onLoaded();
				self.create();
			}).fail(function(jqXHR, textStatus, errorThrown) {
				console.error('%s %c %s %o %c %s', 'error while loading', 'color:#000000', jqXHR.url, 'color:#000000', errorThrown);
			});
		}
	});
};

statisticsChart.requestCache = {};

statisticsChart.options = {
		width : 1280,
		height : 600,
		colors : {
			"com" : 0x6B8F25,
			"user" : 0x234A9C,
			"process" : 0x914C3E
		},
		blockBgColor : 0xEFEFEF,
		itemBgColor : 0xFCFCFC,
		basePlotColor : 0x5777EF,
		axisMargin : 77.5,
		axisMarginBeforeMax : 44.5
};

statisticsChart.prototype.init = function(options) {
	var self = this;
	if (typeof options == "undefined") var options = {};
	this.options = $.extend(true, {}, statisticsChart.options, options);
	
	this.options.graphPosition = {x : window.innerWidth / 2 - this.options.width / 2, y : window.innerHeight / 2 - this.options.height / 2};
	this.objectList = {};
	this.jQ = $(this);
};

statisticsChart.graphObject = {
		type : "",
		subType : "",
		width : 0,
		height : 0,
		title : "",
		subTitle : "",
		desc : ".",
		graphY : "left", 	// "right", "dual"
		arrows : {x : false, y1 : false, y2 : false},
		minX : 0,
		maxX : null,
		minY : 0,
		maxY : null,
		minY2 : 0,
		maxY2 : null,
		gradX : {
			nbr : 0,
			labels : []
		},
		gradY : {
			nbr : 0,
			labels : []
		},
		gradY2 : {
			nbr : 0,
			labels : []
		},
		legendX : "Abcisse",
		legendY1 : "Ordonnée 1",
		legendY2 : "Ordonnée 2",
		legendMulti : false,
		uniteLegendMulti : "",
		splitLegend : false,
		interactive : false,
		randomness : 1,
		offset : {x : 0, y : 0}
};

statisticsChart.prototype.setOnLoaded = function(callback, key, title) {
	this.onLoaded = function(data) {
		return callback(data, this, key, title);
	};
};

statisticsChart.prototype.create = function() {
	//var self = this;

	this.createGraphObjects();
	
	var container = new PIXI.Container(), sprite = new PIXI.Sprite(), legend = new PIXI.Container();
	
	var background = new PIXI.Graphics();
	
	background.beginFill(this.options.blockBgColor, 1);
	background.lineStyle(1, this.options.blockBgColor, 1);
	background.drawRoundedRect(0, 0, this.options.width, this.options.height, 2);
	background.endFill();
	
	sprite.texture = background.generateTexture(renderer);
	sprite.position = {x : 0, y : 0};
	container.addChild(sprite);
	
	$.each(this.objectList, function(index, object) {
		container.addChild(object);
	});
	
	container.position = this.options.graphPosition;
	
	container.addChild(legend);
	
	this.objectList.bg = sprite;
	this.objectList.container = container;
	this.objectList.legend = legend;
	
	stage.addChild(this.objectList.container);
};

statisticsChart.prototype.createGraphObjects = function() {
	this.graphObject = $.extend(true, {}, statisticsChart.graphObject, this.graphData.graphDef);
	this.graphObject.width = this.options.width;
	this.graphObject.height = this.options.height;
	this.prepareGraphs();
	this.plotData();
};

statisticsChart.prototype.prepareGraphs = function() {
	var g = this.graphObject;
	
	var ortho = this.createShape('ortho', {arrows : g.arrows, graphY : g.graphY});
	
	var title = new PIXI.Text(this.graphObject.title.toUpperCase(), {font : '24px Arial', fill : 0x000000, align : 'left'});
	var lineReturnNbr = g.title.match(/\n/) !== null ? g.title.match(/\n/).length : 0;
	var subTitle = new PIXI.Text(this.graphObject.subTitle.toUpperCase(), {font : '16px Arial', fill : 0x777777, align : 'left'});
	var description = new PIXI.Text(this.graphObject.desc.toUpperCase(), {font : 'Bold 15px Arial', fill : 0x000000, align : 'left'});
	
	title.position = {x : 4, y : - title.height - subTitle.height - 12.5};
	subTitle.position = lineReturnNbr == 0 ? {x : 7, y : - subTitle.height} : {x : 7, y : - subTitle.height + lineReturnNbr * 21};
	subTitle.position.y = subTitle.position.y  - 12.5;
	description.position = {x : 4, y : this.options.height + 12.5};

	this.objectList.title = title;
	this.objectList.subTitle = subTitle
	this.objectList.description = description;
	
	ortho.position = {x : this.options.axisMargin, y : this.options.axisMargin};
	this.objectList.repere = ortho;
//	console.log(ortho);
};

statisticsChart.prototype.createShape = function(type, p) {
	var shape = new PIXI.Graphics;
	var fillColor = 0xFFFFFF;
	if (typeof p !== "undefined") {
		shape.lineStyle(p.lineWidth || 1, p.lineColor|| 0x000000, p.alpha || 1);
		fillColor = p.fillColor == 0 ? 0 : 0xFFFFFF;
	}
	switch (type) {
		case "box" :
			shape.lineStyle(p.lineWidth, 0x999999, 1);
			if (typeof p.nofill === "undefined") {
				shape.beginFill(this.options.itemBgColor, 1);
				shape.lineStyle(p.lineWidth, 0xDAD1C7, 1);
			}
			shape.drawRoundedRect(p.x - .5, p.y - .5, p.width + .5, p.height + .5, 5);
			if (typeof p.nofill === "undefined") {
				shape.endFill();
				
				shape.lineStyle(p.lineWidth * 2, p.lineColor, .77);
				shape.moveTo(0, p.lineWidth, p.lineWidth);
				shape.lineTo(0, p.height - p.lineWidth * 2);

				shape.moveTo(p.width - p.lineWidth, p.lineWidth);
				shape.lineTo(p.width - p.lineWidth, p.height - p.lineWidth * 2);
			}
			break;
		case "ortho" : 
			shape.lineStyle(1, 0x000000, 1);
			var orthoWidth = this.options.width - this.options.axisMargin * 2;
			var orthoHeight = this.options.height - this.options.axisMargin * 2
			var orthoYPosX = p.graphY === 'right' ? orthoWidth : 0;
			shape.moveTo(0, orthoHeight + .5);
			shape.lineTo(orthoWidth, orthoHeight + .5);
			
			shape.lineStyle(1, 0x000000, (p.graphY === 'dual' ? .21 :  1));
			shape.moveTo(orthoYPosX, 0);
			shape.lineTo(orthoYPosX, orthoHeight);
			
			if (p.graphY === 'dual') {
				shape.moveTo(orthoWidth, 0);
				shape.lineTo(orthoWidth, orthoHeight);
			}
			
			shape.X = [];
			shape.Y = [];
			shape.Y2 = [];
			shape.xOrigin = orthoYPosX + this.options.axisMargin;
			if (this.graphObject.maxX !== null) {
			this.graphObject.gradX.labels.sort();
			var gradX = this.createShape('gradX', {x : orthoWidth - orthoWidth / this.graphObject.gradX.nbr - .5, y : orthoHeight, i : (!this.graphObject.gradX.nbr ? 0 : this.graphObject.gradX.nbr - 1)});
			shape.addChild(gradX[0]);
			$.merge(shape.X, gradX[1]);
			var subGradX = this.createShape('subGradX', {x : orthoWidth - orthoWidth / this.graphObject.gradX.nbr - .5, y : orthoHeight});
			shape.addChild(subGradX[0]);
			$.merge(shape.X, subGradX[1]);
			}
			if (this.graphObject.maxY !== null) {
			var gradY = this.createShape('gradY', {x : orthoYPosX, y : this.options.axisMarginBeforeMax - .5, i : 0, w : orthoWidth, dual : 1});
			shape.addChild(gradY[0]);
			$.merge(shape.Y, gradY[1]);
			var subGradY = this.createShape('subGradY', {x : orthoYPosX, y : this.options.axisMarginBeforeMax - .5, w : orthoWidth, h : orthoHeight - this.options.axisMarginBeforeMax, dual : 1});
			shape.addChild(subGradY[0]);
			$.merge(shape.Y, subGradY[1]);
			}
			if (p.graphY === 'dual' && this.graphObject.maxY2 !== null) {
				var gradY2 = this.createShape('gradY', {x : orthoWidth, y : this.options.axisMarginBeforeMax - .5, i : 0, w : orthoWidth, dual : 2});
				shape.addChild(gradY2[0]);
				$.merge(shape.Y2, gradY2[1]);
				var subGradY2 = this.createShape('subGradY', {x : orthoWidth, y : this.options.axisMarginBeforeMax - .5, w : orthoWidth, h : orthoHeight - this.options.axisMarginBeforeMax, dual : 2});
				shape.addChild(subGradY2[0]);
				$.merge(shape.Y2, subGradY2[1]);
			}
			
			var dir = p.graphY === 'right' ? - orthoWidth : 0;
			var unitInLegend = this.graphData.abs.unit.length ? ' (' + this.graphData.abs.unit + ')' : '';
			var legendX = new PIXI.Text(this.graphObject.legendX + unitInLegend, {font : '15px Arial', fill : 0x222222, align : 'center'});
			legendX.position = {x : orthoWidth + dir - this.stringWidthFromLength(this.graphObject.legendX, 'Arial', '12px') / 2, y : orthoHeight + 21};
			shape.addChild(legendX);
			
			unitInLegend = this.graphData.ord.unit.length ? ' (' + this.graphData.ord.unit + ')' : '';
			var legendY1 = new PIXI.Text(this.graphObject.legendY1 + unitInLegend, {font : '15px Arial', fill : 0x222222, align : 'center'});
			legendY1.position = {x : orthoYPosX - this.stringWidthFromLength(this.graphObject.legendY1, 'Arial', '12px') / 2, y : - 34};
			shape.addChild(legendY1);
			
			if (p.graphY === 'dual') {
				var legendY2 = new PIXI.Text(this.graphObject.legendY2, {font : '15px Arial', fill : 0x222222, align : 'center'});
				legendY2.position = {x : orthoWidth - this.stringWidthFromLength(this.graphObject.legendY2, 'Arial', '12px') / 2, y : - 34};
				shape.addChild(legendY2);
			}
			
			if (p.arrows.y1 === true) {
			var arrowUp1 = this.createShape('arrow', {fillColor : 0x000000});
			arrowUp1.position = {x : orthoYPosX, y : - 5};
			shape.addChild(arrowUp1);
			}
			
			if (p.arrows.y2 === true) {
			var arrowUp2 = this.createShape('arrow', {fillColor : 0x000000});
			arrowUp2.position = {x : orthoWidth, y : - 5};
			shape.addChild(arrowUp2);
			}
			
			if (p.arrows.x === true) {
				orthoYPosX = p.graphY === 'right' ? - 5 : orthoWidth + 5;
				var rotate = p.graphY === 'right' ? -Math.PI / 2 : Math.PI / 2;
				var arrowX = this.createShape('arrow', {fillColor : 0x000000});
				arrowX.rotation = rotate;
				arrowX.position = {x : orthoYPosX, y : orthoHeight};
				shape.addChild(arrowX);
			}
			
			break;
		case "arrow" : 
			shape.beginFill(fillColor, 1);
			shape.lineStyle(1, 0x000000, 1);
			shape.drawPolygon([0, 0, 2, 5, -2, 5]);
			shape.endFill();
			break;
		case "gradX" : 
			var indexes = [];
			shape.lineStyle(1, 0x000000, (this.graphObject.graphY === 'dual' ? .21 :  1));
			shape.moveTo(p.x, p.y + 2);
			shape.lineTo(p.x, p.y - 2);
			shape.lineStyle(1, 0x000000, .07);
			shape.lineTo(p.x, 0);
			
			indexes.push(p.x);

			var label = typeof this.graphObject.gradX.labels[p.i] === 'undefined' ? Math.floor(this.graphObject.maxX - p.i * (this.graphObject.maxX - this.graphObject.minX) / this.graphObject.gradX.nbr).toString() : this.graphObject.gradX.labels[p.i]
			var text = new PIXI.Text(label, {font : '12px Arial', fill : 0x222222});
//			console.trace(p.i, label);
			text.position = {x : p.x - 5, y : p.y + 7};
			shape.addChild(text);
			return [shape, indexes];
			break;
		case "subGradX" :
			var indexes = [];
			if (this.graphObject.graphY === "right") {
				for(var i = 1; i <= this.graphObject.gradX.nbr; i++) {
					var gradX = this.createShape('gradX', {x : i * p.x / this.graphObject.gradX.nbr, y : p.y, i : i - 1});
					shape.addChild(gradX[0]);
					$.merge(indexes, gradX[1]);
				}
			}
			else {
				for(var i = this.graphObject.gradX.nbr - 1; i > 0 ; i--) {
					var gradX = this.createShape('gradX', {x : i * p.x / this.graphObject.gradX.nbr, y : p.y, i : i - 1});
					shape.addChild(gradX[0]);
					$.merge(indexes, gradX[1]);
				}
			}
			return [shape, indexes];
			break;
		case "gradY" : 
			var indexes = [];
			var max = p.dual === 1 ? this.graphObject.maxY : this.graphObject.maxY2;
			var grad = p.dual === 1 ? this.graphObject.gradY.nbr : this.graphObject.gradY2.nbr;
			
			indexes.push(p.y);
			
			shape.lineStyle(1, 0x000000, 1);
			shape.moveTo(p.x - 2, p.y);
			shape.lineTo(p.x + 2, p.y);
			shape.lineStyle(1, 0x000000, (p.dual === 1 ? .12 : .05));
			var w = (p.dual === 1 && this.graphObject.graphY !== "right") ? p.w : 0;
			shape.lineTo(w, p.y);
			
			var dir = p.dual === 2 ? - .2 : 1;
			var label = typeof this.graphObject.gradY.labels[p.i] === 'undefined' ? (max - p.i * max / grad).toString().match(/^[^\.]*/) : this.graphObject.gradY.labels[p.i]
			var text = new PIXI.Text(label, {font : '12px Arial', fill : 0x222222});
			text.position = {x : p.x - dir * 38, y : p.y - 7};
			shape.addChild(text);
			
			return [shape, indexes];
			break;
		case "subGradY" : 
			var indexes = [];
			var grad = p.dual === 1 ? this.graphObject.gradY.nbr : this.graphObject.gradY2.nbr;
			for(var i = 1; i <= grad; i++) {
				var gradY = this.createShape('gradY', {x : p.x, y : p.y + i * p.h / grad + .5, i : i, w : p.w, dual : p.dual});
				shape.addChild(gradY[0]);
				$.merge(indexes, gradY[1]);
			}
			return [shape, indexes];
			break;
//		case "points" :
//			shape.lineStyle(1, fillColor, 1);
//			shape.beginFill(fillColor, 1);
//			break;
		case "disc" :
			shape.beginFill(fillColor, 1);
			shape.drawCircle(p.x, p.y, p.radius);
			shape.endFill();
			break;
		case "spline" :
			var lineConst = Math.abs((this.options.defaultH_Interval - this.options.handleWidth * 2) / 3.8);
			var antiOver = Math.floor(p.index * lineConst / 4);
			shape.moveTo(0,0);
			shape.lineTo(lineConst - antiOver, 0);
			shape.bezierCurveTo(lineConst * 2 - antiOver, 0, lineConst * 2  - antiOver, - .5, lineConst * 2 - antiOver, p.tensionOffset.y);
			shape.lineTo(lineConst * 2 - antiOver, p.yd - p.tensionOffset.y);
			shape.bezierCurveTo(lineConst * 2 - antiOver, p.yd, lineConst * 2 - antiOver, p.yd, lineConst * 3 - antiOver, p.yd);
			shape.lineTo(p.xd, p.yd);
			return shape; 
			break;
		default : return;
	}
	return shape;
};

statisticsChart.prototype.stringWidthFromLength = function(string, fontFamily, fontSize, fontWeight) {
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
};

statisticsChart.prototype.plotData = function() {
	var self = this;
	this.graphObject.widthFactor = Math.abs((self.options.width - self.options.axisMargin * 3) / (self.graphObject.maxX - self.graphObject.minX));
	
	var dataArray = Object.keys(this.graphData.abs.data);
	dataArray.sort();
	var dataArrayY = Object.keys(this.graphData.ord.data);
	dataArrayY.sort();

	this.colorIndex = [];
	
	switch (this.graphObject.subType) {
		case 'cloud' : 
			this.objectList.plotHelperGraphics = new PIXI.Graphics();
			this.objectList.plotHelper = new PIXI.Container();
			var legend = new PIXI.Graphics();
			var mustShowLegend = false, interactive = false;
			var i = 0;
			var colorAngle;
			
			this.createInfoBox();

			var labelsNbr = 0, uniteArray, colorWheelPos, lumaOffset, type, dataDef, dataToPlot, widthInfo = 0, infoBoxText;
			for (var i = 0, l = dataArrayY.length; i < l; i++) {
				unite = dataArrayY[i];
				data = this.graphData.ord.data[unite];
				
				colorWheelPos = 0;
				lumaOffset = 0;

				uniteArray = Object.keys(data);
				uniteArray.sort();
				
				colorAngle = 255 / uniteArray.length;
				
				// Plot data
				colorWheelPos = 0;
				for (t = 0, tl = uniteArray.length; t < tl; t++) {
					type = uniteArray[t];
					dataDef = data[type];
					
					// Complete missing indexes in colorTable
					if (typeof this.colorIndex[colorWheelPos] === 'undefined') {
						if (dataDef.avg)
							this.colorIndex[colorWheelPos] = [type, Number('0x' + net.brehaut.Color(graphUtils.parseColor(this.options.basePlotColor)).shiftHue((colorWheelPos - 1.79) * colorAngle).toCSS().slice(1))];
						else
							this.colorIndex[colorWheelPos] = [type, Number('0x' + net.brehaut.Color(graphUtils.parseColor(this.options.basePlotColor)).shiftHue((colorWheelPos - 1.79) * colorAngle).lightenByAmount((colorWheelPos % 2) * .1).toCSS().slice(1))];
					}
					
					if (typeof dataDef.avg !== 'undefined' || typeof dataDef.md !== 'undefined') {
						interactive = true;
						dataToPlot = dataDef.md || dataDef.avg;
						widthInfo = dataDef.rms ? dataDef.rms : true;
						infoBoxText = type + (dataDef.rms ? ' // Ecart-type : ' + Math.floor(dataDef.rms) : '');
						this.plotCloudData(i, colorAngle, colorWheelPos, dataToPlot, widthInfo, this.graphObject.interactive, 2, infoBoxText);
					}
					else {
						mustShowLegend = true;
						for (var idx = 0, valLen = dataDef.length; idx < valLen; idx++) {
							this.plotCloudData(i, colorAngle, colorWheelPos, dataDef[idx], widthInfo, this.graphObject.interactive, 1, type);
						}
					}
					
					colorWheelPos++;
				}
				labelsNbr++;
			};
			
			if (this.graphObject.legendMulti) {
				var interval = 255, splitHue = 0, offset =  -512 - this.colorIndex.length * 101;
				this.createLegend(interval, splitHue, offset);
			}
			
			this.objectList.plots = this.objectList.plotHelper;

			break;
		case 'histoSpectrum' :
			this.objectList.plotHelperGraphics = new PIXI.Graphics();
			var legend = new PIXI.Graphics();
			var colorAngle = -300 / Object.keys(this.graphData.abs.data).length + 1;
			var barsInterval = this.graphObject.widthFactor;
			var barWidth = 101;
			
			var label, unit, uniteArray, data, xPos, blockOffset, colorWheelPos = 0, unitArray, yTarget, g, cat, dataset, yPos, color, subBlock, modulator, caseArray, caseProg, caseNo, result, subBlockGraphics, randomColorShift, subCatHeight, subBlockPos;
			var yUnit = (this.options.height - this.options.axisMargin * 2 - this.options.axisMarginBeforeMax) / this.graphData.graphDef.maxY;
			
			var labelsNbr = 1, blockOffset = 0;
			for (var i = 0, l = dataArrayY.length; i < l; i++) {
				unit = dataArrayY[i];
				data = this.graphData.ord.data[unit];

				yPos = this.graphObject.gradY.nbr === 0 ? this.objectList.repere.position.y + this.options.height - this.options.axisMargin * 2 : this.objectList.repere.position.y + this.objectList.repere.Y[i] - .5;
				
				colorWheelPos = 0;
				
				uniteArray = Object.keys(data);
				uniteArray.sort();
				
				colorAngle = 270 / uniteArray.length;
				
				for (var t = 0, tl = uniteArray.length; t < tl; t++) {
					var type = uniteArray[t];
					var dataDef = data[type];
					
					for (var idx = 0, valLen = dataDef.length; idx < valLen; idx++) {
						if (!dataDef[idx])
							continue;
						if (!this.colorIndex[colorWheelPos])
							this.colorIndex[colorWheelPos] = [type, Number('0x' + net.brehaut.Color(graphUtils.parseColor(this.options.basePlotColor)).shiftHue((colorWheelPos - 1.1) * colorAngle * 1.55).lightenByAmount(0).toCSS().slice(1))];
						this.objectList.plotHelperGraphics.lineStyle(this.graphObject.splitXpos ? 4 : 2, this.colorIndex[colorWheelPos][1], .84);
						
						xPos = this.graphObject.splitXpos === true
							? this.objectList.repere.xOrigin - idx * this.graphObject.widthFactor - 5 - t * 3
							: this.objectList.repere.xOrigin - idx * this.graphObject.widthFactor - 5;
						
						this.objectList.plotHelperGraphics.moveTo(
								xPos,
								yPos
							);
						yTarget = this.objectList.repere.position.y + (this.graphObject.gradY.nbr === 0 ? this.options.height - this.options.axisMargin * 2 : this.objectList.repere.Y[i]) - Math.min(dataDef[idx] * this.objectList.repere.height * this.graphObject.scaleY / Object.keys(this.graphData.ord.data).length, (this.options.height - this.options.axisMargin * 2.7) / Object.keys(this.graphData.ord.data).length);

						if (dataDef[idx]) {
							this.objectList.plotHelperGraphics.lineTo(
									xPos,
									yTarget
								);
						}
					}
					colorWheelPos++;
				}
				labelsNbr++;
			}
			this.objectList.plots = this.objectList.plotHelperGraphics;

			var interval = (this.options.width - this.options.axisMargin * 2) / (this.colorIndex.length + 2), splitHue = 0, offset = -512 - this.colorIndex.length * 101;
			this.createLegend(interval, splitHue, offset);
			
			break;
		case 'histoMulti' : 
			this.objectList.plotHelperGraphics = new PIXI.Graphics();
			
			var colorAngle = -300 / Object.keys(this.graphData.abs.data[dataArray[0]]).length + 1;
			var barsInterval = this.graphObject.widthFactor;
			var barWidth = this.objectList.repere.width / (dataArray.length + 2) - 24;
			
			var label, data, xPos, blockOffset, colorWheelPos, unitArray, g, cat, dataset, yPos, color, subBlock, modulator, caseArray, caseProg, caseNo, result, subBlockGraphics, randomColorShift, subCatHeight, subBlockPos;
			var yUnit = (this.options.height - this.options.axisMargin * 2 - this.options.axisMarginBeforeMax) / this.graphData.graphDef.maxY;

			this.createInfoBox();

			var labelsNbr = 1;
			for (var i = 0, l = dataArray.length; i < l; i++) {
				label = dataArray[i];
				data = this.graphData.abs.data[label];
				
				xPos = this.objectList.repere.X[l - i - 1] + this.options.axisMargin;

				blockOffset = 0;
				colorWheelPos = 0;
				
				unitArray = Object.keys(data);
				unitArray.sort();
				
				for (g = unitArray.length - 1; g >= 0; g--) {
					cat = unitArray[g];
					dataset = data[cat];
					
					color = this.graphData.colorTable[unitArray.length - 1 - g] || Number('0x' + net.brehaut.Color(graphUtils.parseColor(this.options.basePlotColor)).shiftHue(colorWheelPos * colorAngle).toCSS().slice(1));
					
					if (Object.keys(dataset).length) {
						yPos = this.objectList.repere.position.y + this.options.height - this.options.axisMargin * 2 - blockOffset - .5;
						
						if (!this.colorIndex[g]) {
							this.colorIndex[g] = [cat, color];
						}
						
						subBlock = new PIXI.Sprite(), subBlockGraphics = new PIXI.Graphics(), subBlockPos = 0;
						modulator = 2
						caseArray = Object.keys(dataset);
						
						for (caseProg = 0, len = caseArray.length; caseProg < len; caseProg++, subBlock = new PIXI.Sprite()) {
							
							caseNo = caseArray[caseProg];
							result = dataset[caseNo].result;
//							console.log(dataset);
							randomColorShift = 24 * (modulator % 2 - .5); 
							subCatHeight = result > 12 ? Math.ceil(result * yUnit) : Math.floor(result * yUnit);
							
							color = Number('0x' + net.brehaut.Color(graphUtils.parseColor(color)).shiftHue(randomColorShift).toCSS().slice(1));
//							console.log(result);
							subBlockGraphics.beginFill(color, 1);
							subBlockGraphics.drawRect(
									0,
									0,
									barWidth,
									subCatHeight
								);
							subBlockGraphics.endFill();
							subBlock.texture = subBlockGraphics.generateTexture(renderer);
							subBlockGraphics.clear();
							
							subBlock.position = {x : xPos - barWidth / 2, y : yPos - subBlockPos - subCatHeight};
							subBlock.interactive = true;
							subBlock.infoBoxText = dataset[caseNo].infoBox + ' : ' + self.graphObject.legendY1 + ' : ' + result;
							subBlock.on('mouseover', function(e) {
								self.objectList.infoBoxText.text =  this.infoBoxText;
							});
//							console.log(label, cat, caseNo, subBlockPos, subBlock.position);
							this.objectList.plotHelperGraphics.addChild(subBlock);
							
							subBlockPos += subCatHeight// - (result > 0 ? .22 : 0);
							modulator++;
						};

						dataset.total = dataset['unique'] ? dataset['unique'].result : dataset.total;
						blockOffset += subBlockPos//dataset.total * yUnit;
					}
					colorWheelPos++;
				};
				labelsNbr++;
			}
			this.objectList.plots = this.objectList.plotHelperGraphics;
			
			var interval = barsInterval * .77, splitHue = (this.graphObject.splitLegend ? 12 : 0), offset = 300;
			if (this.graphObject.legendMulti)
				this.createLegend(interval, splitHue, offset);
	}
};

statisticsChart.prototype.plotCloudData = function(masterIndex, colorAngle, colorWheelPos, dataToPlot, widthInfo, interactive, bigger, infoBoxText) {
	var self = this;
	var plot = new PIXI.Sprite();
	var info = new PIXI.Sprite();
	info.alpha = 0;

	if (!infoBoxText)
		infoBoxText = "Aucune information à afficher";
	if (!bigger)
		bigger = 1;
	
	var Xpos = Math.floor(this.objectList.repere.xOrigin - dataToPlot * this.graphObject.widthFactor - 7 * bigger / 2) - .5;
	var	Ypos = this.objectList.repere.position.y + this.objectList.repere.Y[masterIndex] + (Math.random() * 2 - 1) * this.objectList.repere.height * .34 * this.graphObject.randomness / Object.keys(this.graphData.ord.data).length - 7 * bigger;

//	this.objectList.plotHelperGraphics.clear();
	this.objectList.plotHelperGraphics.lineStyle(2, this.colorIndex[colorWheelPos][1], 1);
//	this.objectList.plotHelperGraphics.beginFill(this.colorIndex[colorWheelPos][1], (bigger > 1 ? bigger * 2 : 1) * .24);
	this.objectList.plotHelperGraphics.moveTo(0, 0);
	this.objectList.plotHelperGraphics.lineTo(0 + 3.5 * bigger, 3.5 * bigger);
	this.objectList.plotHelperGraphics.lineTo(0, 7 * bigger);
	this.objectList.plotHelperGraphics.lineTo(0 - 3.5 * bigger, 3.5 * bigger);
	this.objectList.plotHelperGraphics.lineTo(0, 0);
	
	plot.texture = this.objectList.plotHelperGraphics.generateTexture(renderer);
	plot.position = {
			x : Xpos,
			y : Ypos
	};
	this.objectList.plotHelperGraphics.clear();
	this.objectList.plotHelper.addChild(plot);
	
	// Info
	if (widthInfo) {
		this.objectList.plotHelperGraphics.lineStyle(4, this.colorIndex[colorWheelPos][1], .44);
		this.objectList.plotHelperGraphics.moveTo(
				0,
				0
		);
		this.objectList.plotHelperGraphics.lineTo(
				Math.min(widthInfo * 2 * this.graphObject.widthFactor, this.objectList.repere.width + this.options.axisMargin - Xpos + this.graphObject.widthFactor * widthInfo - 3.5 * bigger),
				0
		);
		info.texture = this.objectList.plotHelperGraphics.generateTexture(renderer);
		info.position = {
				x : Xpos - this.graphObject.widthFactor * widthInfo,
				y : Ypos + 3.5 * bigger - 2
		};
		this.objectList.plotHelperGraphics.clear();
		this.objectList.plotHelper.addChild(info);
	}

	if (interactive) {
		plot.interactive = true;
		plot.on('mouseover', function(e) {
			self.objectList.infoBoxText.text = infoBoxText;
			info.alpha = 1;
		});
		plot.on('mouseout', function(e) {
			self.objectList.infoBoxText.text = infoBoxText;
			info.alpha = 0;
		});
	}
};

statisticsChart.prototype.createLegend = function(interval, splitHue, offset) {
	var canvas, context, grd, sprite;
	var max = this.colorIndex.length - 1, legXpos, legYpos, legendText, legendInterval = 0;
	var legend = new PIXI.Graphics();

	legendText = new PIXI.Text(this.graphObject.uniteLegendMulti + ' : ', {font : '15px Arial', fill : 0x222222, align : 'center'});
	legendText.position = {x : this.objectList.repere.xOrigin, y : this.options.height -15 - 22};
	legend.addChild(legendText);

	legend.lineStyle(1, 0x0, .12);
	for (var leg = max; leg >= 0; leg--) {
//		console.log(this.colorIndex[leg][1].toString(16));
		canvas = document.createElement('canvas');
		canvas.width = 24;
		canvas.height = 15;
		canvas.style.position = 'absolute';
	    context = canvas.getContext('2d');
	    context.rect(0, 0, 23.5, 14.5);
		grd = context.createLinearGradient(12, 0, 12, 14.5)
		grd.addColorStop(0, net.brehaut.Color(graphUtils.parseColor(this.colorIndex[leg][1])).shiftHue(-splitHue).toCSS());
		grd.addColorStop(0.49, net.brehaut.Color(graphUtils.parseColor(this.colorIndex[leg][1])).shiftHue(-splitHue).toCSS());
		grd.addColorStop(.5, net.brehaut.Color(graphUtils.parseColor(this.colorIndex[leg][1])).shiftHue(splitHue).toCSS());
		grd.addColorStop(1, net.brehaut.Color(graphUtils.parseColor(this.colorIndex[leg][1])).shiftHue(splitHue).toCSS());
		context.fillStyle = grd;
	    context.fill();
		sprite = new PIXI.Sprite(PIXI.Texture.fromCanvas(canvas));
		
		legend.beginFill(0x777777, 0);
		legXpos = this.objectList.repere.xOrigin + offset + legendInterval;
		legYpos = this.options.height -15 - 22;
		legend.drawRect(
				legXpos,
				legYpos ,
				24,
				15
			);
		legend.endFill();
		legendText = new PIXI.Text(this.colorIndex[leg][0], {font : '12px Arial', fill : 0x222222, align : 'center'});
		legendText.position = {x : legXpos + 29, y : legYpos};
		
		legendInterval += legendText.width + 255 / max + 38;
		
		sprite.position = {x : legXpos + .2, y : legYpos + .44};
		
		legend.addChild(sprite);
		legend.addChild(legendText);
	}

	this.objectList.legend = legend;
}

statisticsChart.prototype.createInfoBox = function() {
	var infoBoxLegend = new PIXI.Text('Informations Contextuelles : ', {font : '12px Arial', fill : 0x222222, align : 'center'});
	infoBoxLegend.position = {x : 15, y : 15};
	this.objectList.plotHelperGraphics.addChild(infoBoxLegend);
	
	this.objectList.infoBoxText = new PIXI.Text('Survolez le graphique avec la souris pour afficher des informations détaillées', {font : '12px Arial', fill : 0x222222, align : 'center'});
	this.objectList.infoBoxText.position = {x : 177, y : 15};
	this.objectList.plotHelperGraphics.addChild(this.objectList.infoBoxText);
}