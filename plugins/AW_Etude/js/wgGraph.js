if (!WG) 
	var WG = {};

WG.additionalOptions = {
		printMode : (window.location.href.match(/print/) !== null ? true : false),
		printDeveloppedMode : (window.location.href.match(/printDevelopped/) !== null ? true : false),
		debugMode: (window.location.href.match(/debug/) !== null ? true : false),
		debugStop: (window.location.href.match(/stop/) !== null ? window.location.href.match(/stop=([^&]*)/)[1] : false),
		uniqueGraph: (window.location.href.match(/uniqueGraph/) !== null ? window.location.href.match(/uniqueGraph=([^&]*)/)[1] : false)
};

WG.requestCache = {length : 0};
WG.interactList = {};
WG.interactListIndexes = [];

WG.showLoadingIdent = function(init, waitingInc) {
	if (init) {
		// Loading Ident
    	loadingTextBlock = $('<p>', {'class':'message'});
    	ready_statement.empty().append(
    			loadingTextBlock,
    			$('<p>', {'class':'link'})
    			)
	}

	ready_statement.show().css({opacity : 1});
	loadingTextBlock.empty().append($('<span/>', {id : 'loading_text'}).html('Loading*'));
	var timer = 0;
	(function waiting() {
		if (timer % 20 === 0)
			loadingTextBlock.append($('<span/>').html('.'));
		timer++;
		if (waitingIncrement === true &&  waitingInc === true)
			requestAnimationFrame(waiting);
	})();
}

WG.anyGraphInit = function(Id, graphsPath) {
	
	// Give the ability to caller to display the stage title earlier
	if (stage.children.length === 0) {
		var title = new PIXI.Text('Arte Graph Explorer v1.0 RC', {font : '12px Fjalla One', fill : 0});
		title.position = {x : 7, y : 7};
		stage.addChild(title);
		var loading = new PIXI.Text('Loading', {font : '12px Fjalla One', fill : 0});
		loading.position = {x : 151, y : 7};
		stage.addChild(loading);
	}
	
	mainGraph = new workflowSuperGraph({masterGraph : true, graphsPath : graphsPath});
	mainGraph.__type = 'topGraph';
	
	var graphDef = graphLoader(Id, 'graphTree', graphsPath);
	if (typeof graphDef !== 'string') {
		mainGraph.setAsyncGraphDef = graphDef;
	}
	else {
		mainGraph.id = Id;
		mainGraph.title = 'graphTree';
		mainGraph.rawGraphDef = graphDef;
		mainGraph.prepareGraphDef();
		initStage();
	}
	
	$(document).ajaxStop(function(e) {
		initStage();
	});
	
	function initStage() {
		stage.removeChildAt(1);
		stage.addChild(mainGraph.objectList.superBox);
		ready_statement.animate({opacity : 0, queue : true}, 512).hide();
		mainInteract.connect(mainGraph);
		mainInteract.animateHello();
		waitingIncrement = false;
		WG.multiGraphMode = false;
//		console.log('ajaxStop');
		
		if (mainGraph && mainGraph.options.printDeveloppedMode === true) {
			setTimeout(function() {
    			ready_statement.show().find('span[id!="loading_text"]').remove();
    			ready_statement.find('span#loading_text').html('expanding before print : block&nbsp;1')
    			var i = 0, controler, id;
    			for (var index = 0, l = WG.interactListIndexes.length; index < l; index++) {
    				id = WG.interactListIndexes[index];
    				controler = WG.interactList[id];
    				(function(i, id, index, controler) {
    					setTimeout(function() {
    						ready_statement.show().css({opacity : 1});
    						loadingTextBlock.find('span#loading_text').html('expanding before print : block&nbsp;' + (index + 1) + ' ' + id)
	    					controler.toggleExpand('expand');
	    				}, i);
    				})(i, id, index, controler);
    				i += 3001;
    			};
    			setTimeout(function() {
    				mainInteract.superContainer.position = {x : -21, y : 38};
    				ready_statement.find('span#loading_text').html('expanding before print : done').animate({opacity : 0}, 3001);
    			}, i + 3001);
			}, 1280);
		}
	}
}

var defaultBoxDef = {
		subflow : "",		// "user" / "process" / "com",
		subTask : "",
		id : "",
		type : "",
		title : "",
		subTitle : "",
		content : "",
		external : false,
		gridHook : {x : false, y : false},
		offset : {x : 0, y : 0},
		width : 113,
		height : 300,
		targets : [
		        {
				target : -1,
				versions : [
					{
						legendOut : "",
						legendIn : ""	
					}
				],
				subflow : '',
				largeLink : false,
				dashed : false,
				thin : false,
				handleOffset : 0,
				innerTarget : {
					target: -1,
					versions: [
						{
							legendOut: "",
							legendIn: ""
						}
					]
				}
		    }
		],
		feedbacks : [
			    {
				target : -1,
				versions : [
					{
						legendOut : "",
						legendIn : ""	
					}
			    ],
				subflow : ""
			}
		],
		receivedLinks : 0,
		duration : 5,
		receivedLinksHack : 0,
		emittedLinksHack : 0,
		inverseHandlesOutHack : false,
		inverseHandlesInHack : false
};

var workflowGraph = function(options) {
	this.options = $.extend(true, {}, WG.options, WG.additionalOptions, options);

	this.view = renderer.view;
	this.__type = 'subGraph';
	// We could have also used $.extend()
	this.defaultBoxDef = $.extend(true, {}, defaultBoxDef);

	this.randomizeCounter = 0;
	
	this.objectList = {};
	this.objectList.boxes = {};
	
	this.objectList.bg = new PIXI.Sprite();
	this.objectList.foreG = new PIXI.Sprite();
	
	this.objectList.subContainer = new PIXI.Container();
	this.objectList.subContainer.__type = 'subContainer';
	this.objectList.superBox = new PIXI.Container();
	this.objectList.superBox.__type = 'superBox';
	
	this.objectList.superBox.title = new WG._text('', ['normal', '72px', 'Proxima Nova Condensed Thin'], [0x000000, 1], 'center', {x : 51, y : 2});
	this.objectList.superBox.title._text.__type = 'bigTitle';
	this.objectList.superBox.title._text.alpha = 0;
	
	this.objectList.subContainer.position = {x : 77, y : 44};
	this.objectList.foreG.position = this.objectList.bg.position = {x : 1, y : 44};
	
	this.objectList.superBox.addChild(this.objectList.bg);
	this.objectList.superBox.addChild(this.objectList.subContainer);
	this.objectList.superBox.addChild(this.objectList.superBox.title._text);
	this.objectList.superBox.addChild(this.objectList.foreG);

	this.objectList.superBox.graph = this;
	
	this.onLoaded = function() {};
	
	Object.defineProperty(this, "setAsyncGraphDef", {
		set : function (graphDefLoadingDeferred) {
			var self = this;
//			console.log(workflowGraph.requestCache)
			graphDefLoadingDeferred.then(function(data, textStatus, jqXHR) {
//				console.log(self.__type);
				WG.requestCache[jqXHR.id] = data;
				self.id = jqXHR.id;
				self.title = jqXHR.title;
//				if (!self.validateJSON(data)) {
//					return false;
//				}
				self.rawGraphDef = data;
				self.prepareGraphDef();
			}).fail(function(jqXHR, textStatus, errorThrown) {
				console.error('%s %c %s %o %c %s', 'error while loading', 'color:#000000', jqXHR.title, jqXHR.url, 'color:#000000', errorThrown);
			});
		}
	});
};

workflowGraph.prototype.setOnLoaded = function(callback, key, title) {
	this.onLoaded = function() {
		callback(this, key, title);
	};
};

workflowGraph.prototype.constructor = workflowGraph;

var graphLoader = function(id, title, graphsPath, noCache) {
	var slash = (graphsPath && graphsPath.slice(-1) !== '/') ? '/' : '';
	
	// Request Cache
	if (typeof WG.requestCache[id] === 'undefined' || noCache) {
		if (!WG.requestCache[id])
			WG.requestCache.length++;
		
		WG.requestCache[id] = $.ajax( 
				{
					url : (graphsPath || '') + slash + "graphs/workflowGraph_" + id + ".json", 
					type : "get",
					dataType : "text",
					beforeSend: function(jqXHR, settings) {
				        jqXHR.url = settings.url;
				        jqXHR.id = id;
				        jqXHR.title = title.replace(/\n/g, ' ');
				    }
				}
			);
	}
	
	return WG.requestCache[id];
};

workflowGraph.prototype.prepareGraphDef = function() {
	var def = json_parse(this.rawGraphDef, 2); 	// custom parser : returns an array of two values [result, index] keeping track of the order of the properties
	this.graphDef = def[0].graph;
	
	// Loop once here as we need to know very early how many subGraphs should be loaded
	this.superGraphNbr = 0;
	for (var key in this.graphDef) {
		if (this.graphDef[key].id && this.graphDef[key].id.length > 0) {
			this.superGraphNbr++;
		}
	}

	var optionsNbr = Object.keys(def[0].options).length;	// Problem with the custom parser : all keys of level 2 are returned : we only want the "graph" object
	if (optionsNbr !== 0) {	
		for (var i = 0; i < optionsNbr; i++) {
			def[1].shift();
		}
	}
	this.indexArray = def[1];
	this.options = $.extend(true, {}, this.options, def[0].options);
	this.__type = this.options.type || this.__type;

	// Complete User GraphDef : we'll need full objects
	this.completeGraphDef();

	this.init();
	
	this.onLoaded();
}

workflowGraph.prototype.init = function() {
	console.log('Mode : subGraph, Loaded graph ' + this.id + ' : ' + (this.title || ''));

	// call again initGrid() later if you change the default box height
	this.initGrid();

	this.createBoxObjects();
};

workflowGraph.prototype.completeGraphDef = function () {
	var self = this;
//	console.log(this.__type);
	if (this.__type === 'topGraph' || this.__type === 'superGraph')
		this.defaultBoxDef.height = this.defaultBoxDef.height * this.options.superBoxHardScale.y;
	$.each(this.graphDef, function(index, graphDef) {
		self.graphDef[index] = $.extend(true, {}, self.defaultBoxDef, graphDef);
	});
};

workflowGraph.prototype.initGrid = function () {
	this.grid = {};
	this.grid.rows = [0, 0];
	this.grid.cols = [];
	this.grid.usedRows = [false, false, false, false];
	
	this.grid.rowsRef = [];
	if (this.__type !== 'topGraph' && this.__type !== 'superGraph')
		this.grid.rowsRef[0] = this.defaultBoxDef.height / 2;
	
	this.grid.colsRef = [];
	
	this.generateGrid(1);
}

workflowGraph.prototype.generateGrid = function (startPoint) {
	this.grid.rows[0] = this.options.defaultV_Interval;
	for (var i = startPoint; i < this.grid.rowsRef.length; i++) {
		this.grid.rows[i] = this.grid.rows[i - 1] + this.grid.rowsRef[i - 1] + this.options.defaultV_Interval * 2;
	}
	this.grid.cols[0] = this.options.graphStartingPoint.x;
	for (var i = startPoint; i < this.grid.colsRef.length; i++) {
		this.grid.cols[i] = this.grid.cols[i - 1] + this.grid.colsRef[i - 1] + this.options.defaultH_Interval;
	}
};

workflowGraph.prototype.updateGrid = function() {
	var self = this, update = false;

	// Check for unused rows and try to gain display surface
	$.each(this.grid.rowsRef, function(key, rowRef) {
		if (self.grid.usedRows[key] === false) {
			self.grid.rowsRef[key] = 0;
			update = true
		}
	});
	if (update === true) {
		this.generateGrid(1);
		this.reDrawAll();
	}
};

workflowGraph.prototype.setLineHeight = function (lineNbr, key) {
	var box = this.objectList.boxes[key];

	if (((typeof box.superBox === 'undefined' || box.superBox.developped === false) && box.height > this.grid.rowsRef[lineNbr])
			|| (typeof box.superBox !== 'undefined' && box.superBox.developped === true && box.height < this.grid.rowsRef[lineNbr])) {
		this.grid.rowsRef[lineNbr] = Math.floor(box.height) - 2;
		this.generateGrid(lineNbr);
	}

};

workflowGraph.prototype.createBoxObjects = function() {
	var self = this, index, graphDef, newBox, box, handleNbr, keyOffset, superBox = false;


	// Prepare Boxes
	for (var c = 0, l = this.indexArray.length; c < l; c++) {
		keyOffset = 0;
		index = this.indexArray[c];
		graphDef = this.graphDef[index];
		
		// debug case : ability to stop creation loop at a specific point
		if (self.options.debugStop !== false && self.options.debugStop == index)
			break;
		
		// prospective : maybe some day we'd have to construct the graph again
		if (self.objectList.boxes[index]) {
			self.objectList.subContainer.removeChild(self.objectList.boxes[index]);
			delete self.objectList.boxes[index];
		}

		// New Box
		newBox = new WG.Box(self, graphDef.height, index, graphDef.title, graphDef.subTitle, graphDef.content, graphDef.subflow, graphDef.subTask, graphDef.external, graphDef.gridHook, graphDef.offset, [graphDef.emittedLinksHack, graphDef.receivedLinksHack], graphDef.duration, superBox)
		newBox.__id = index;
		
		// Prepare handleOut
		handleNbr  = graphDef.targets[0].target !== -1 ? graphDef.targets.length + (graphDef.feedbacks[0].target !== -1 ? graphDef.feedbacks.length : 0) : 0;

		$.each(graphDef.targets, function(key, targetDef) {
			if (targetDef.target != -1) {
				keyOffset++;
				newBox.addHandleOut(targetDef.target, targetDef.subflow || graphDef.subTask || graphDef.subflow, key, Object.keys(targetDef.versions).length, handleNbr, targetDef.handleOffset)
				if (!self.graphDef[targetDef.target]) {
					console.log((graphDef.title || key) + ' : cible introuvable : ' + targetDef.target);
					return;
				}
				self.graphDef[targetDef.target].receivedLinks++;

				// Prepare version link
				var i = 0;
				$.each(targetDef.versions, function(name, version) {
					newBox.handlesOut[key].addSpline(i, version.legendOut, version.legendIn, targetDef.dashed, targetDef.largeLink, targetDef.thin);
					i++;
				});
				
				// Prepare InnerLink
				if (targetDef.innerTarget && targetDef.innerTarget.target != -1) {
					newBox.handlesOut[key].innerTarget = targetDef.innerTarget;
				}
			}
		});
		
		$.each(graphDef.feedbacks, function(key, feedbackDef) {
			if (feedbackDef.target != -1) {
				if (keyOffset) {
					key = key + keyOffset;
				}
				
				newBox.addHandleOut(feedbackDef.target, feedbackDef.subflow || graphDef.subTask || graphDef.subflow, key, Object.keys(feedbackDef.versions).length, handleNbr)
				if (!self.graphDef[feedbackDef.target]) {
					console.log((graphDef.title || key) + ' : cible feedback introuvable : ' + feedbackDef.target);
					return;
				}
				self.graphDef[feedbackDef.target].receivedLinks++;

				// Prepare version link
				var i = 0;
				$.each(feedbackDef.versions, function(name, version) {
					newBox.handlesOut[key].addSpline(i, version.legendOut, version.legendIn, feedbackDef.dashed, feedbackDef.largeLink, feedbackDef.thin);
					i++;
				});
				newBox.handlesOut[key].feedback = true;
			}
		});
		
		newBox.reverseHandlesOut = (newBox.handlesOut.length !== 0 && newBox.handlesOut[newBox.handlesOut.length - 1].feedback === true) ? true : graphDef.inverseHandlesOutHack;
		
		self.objectList.boxes[index] = newBox;
		self.randomizeCounter++;
	}
	
	// Position Boxes
	for (c = 0, l =  this.indexArray.length; c < l; c++) {
		index = this.indexArray[c];
		box = this.objectList.boxes[index];
		
		// Debug Stop case
		if (!box)
			break;
		
		if (c === 0) {
			box.getAbsolutePosition();
			box.completeBoxDefFromAbs();
		}
		
		if (box.placed !== true && box.handlesIn.length == 0 && box.handlesOut.length === 0) {
			box.getAbsolutePosition();
			box.completeBoxDefFromAbs();
		}
		
		$.each(box.handlesOut, function(key, handle) {
			// Assign Target
			handle.target = self.objectList.boxes[handle.targetId];

			// Debug Stop case
			if (!handle.target)
				return false;
			// debug Mode : track target assignement & box positionning
			if (self.options.debugMode === true) {
				console.log('%c %s', 'color:#555555', box.__title + ' (' + box.__id + ')')
				console.log('  => %c %s %c %s %c %s', 'color:IndianRed', 'assign target', 'color:RoyalBlue', 'target :', 'color:#555555', handle.target.__title + ' (' + handle.targetId + ')')
			}
			
			// box positionning : forward or reverse
			if (handle.target.placed !== true) {
				handle.target.reference = [box, key];
				handle.target.indexAsATarget = key;
			}
			else if (box.placed !== true && handle.feedback !== true) {
				box.backwardReference = true;
				box.getPositionFromTarget(key);
				box.completeBoxDefFromTarget(key);
			}

			// HandleIn on target box : Create and set position
			handle.target.addHandleIn(index, handle.target.subTask || handle.target.subflow, handle.target.handlesIn.length, handle.linksNbr, self.graphDef[handle.targetId].receivedLinks)
			handle.updateTarget();
			
			// Reverse handles
			handle.target.reverseHandlesIn = self.graphDef[handle.targetId].inverseHandlesInHack;
			
			// version Link from handleOut : draw
			var i = 0;
			$.each(handle.splines, function(k, s) {
				handle.updateSpline(i);
				i++;
			});
		});
		
		box.shape.setChildIndex(box.shape.children[1], box.shape.children.length - 1);
	}
	
	// Check for unused rows and try to gain display surface
	this.updateGrid();
	
	if (this.options.uniqueGraph === false) {
		this.objectList.subContainer.alpha = 0;
		this.objectList.bg.alpha = 0;
	}
	this.objectList.foreG.alpha = 0;

	this.objectList.superBox.developped = false;
};

workflowGraph.prototype.createBg = function(whatAmI) {
	var bgElem = new PIXI.Graphics();
	var bgText = new PIXI.Text('', {font : '38px Fjalla One', fill : 0xDDDDDD, align : 'center'});
	var container = new PIXI.Container();

	var width = 0, bgColor = 0xF7F7F7;
	
	this.objectList.bg.texture = PIXI.Texture.EMPTY;

	if (whatAmI === 'parent') {
		width = this.objectList.gizmoBox ? this.objectList.gizmoBox.width : this.objectList.superBox.width / this.objectList.superBox.scale.x;
	}
	else
		width = this.objectList.superBox.width / this.objectList.superBox.scale.x;

	var heightSum = this.grid.rows[0] - this.options.defaultV_Interval;
	
	for (var i = 0; i < this.grid.rowsRef.length; i++, bgElem = new PIXI.Graphics(), bgText = new PIXI.Text('', {font : '38px Fjalla One', fill : 0xDDDDDD, align : 'center'})) {
			if (this.__type !== 'superGraph')
				bgColor = this.options.blockBgColor[i] || 0xF1F1F1;
			bgElem.beginFill(bgColor, 1);
			bgElem.lineStyle(1, graphUtils.lighterColor(this.options.blockBgColor[i]) || 0xFFFFFF, 1);
			bgText.position.x = 12;
			
			bgElem.drawRoundedRect(0, 0, width - 2.1, this.grid.rowsRef[i] + this.options.defaultV_Interval * 2, 2);
			bgElem.position = {x : 0, y : heightSum - this.options.defaultV_Interval};
			bgText._text = this.options.bgLabels[i] || '';
			
			bgElem.endFill();
			
			heightSum += this.grid.rowsRef[i] + this.options.defaultV_Interval * 2;
			container.addChild(bgElem);
			
			bgText.position.y = bgElem.height / 2 + graphUtils.stringWidthFromLength(bgText._text, 'Fjalla One', '34px', 'bold') / 2;
			bgText.rotation = - Math.PI / 2;
			if (this.__type !== 'topGraph' && this.__type !== 'superGraph' && this.grid.usedRows[i] === true )
				bgElem.addChild(bgText);
	}
	
	var heightBase = this.grid.rows[0] - this.options.defaultV_Interval * 2;
	if (this.options.clockMode.on === true) {
		bgElem = new PIXI.Graphics();
		bgText = new PIXI.Text('', {font : '12px Arial', fill : 0x000000});
		var oneMinuteWidth = Math.floor((this.defaultBoxDef.width / 60) / this.options.clockMode.durationBlockWidthFactor)  - .05;
		for (var l = this.objectList.subContainer.position.x - 1; l < width; l += 15 * oneMinuteWidth, bgElem = new PIXI.Graphics(), bgText = new PIXI.Text('', {font : '12px Arial', fill : 0x000000})) {
			var minuteReadable = Math.floor(((l - this.objectList.subContainer.position.x + 1) / oneMinuteWidth));
			bgElem.lineStyle(1, 0xFAFAFA, 1);
			bgElem.moveTo(l - .5, heightBase);
			bgElem.lineTo(l - .5, heightSum - this.options.defaultV_Interval);
			bgText.text = minuteReadable.toString();
			bgText.position = {x : l, y : heightBase};
			if (minuteReadable % 60 === 0)
				bgElem.addChild(bgText);
			container.addChild(bgElem);
		}
	}

	this.objectList.bg.texture = container.generateTexture(renderer);

	// Be carefull not to loose the reference when we reset the scale : scale is referenced by the tween object
//	if (whatAmI === 'parent') 
		this.objectList.bg.scale.x = 1;
		this.objectList.bg.scale.y = 1;	// weird behavior of PIXI which modifies the scale after having assigned a new texture
	this.objectList.bg.__type = 'bg';
};

workflowGraph.prototype.createForeG = function(whatAmI) {
	if (!this.objectList.foreG)
		return
	var elem = new PIXI.Graphics();
	this.resetForeG();
	var width = 0, height = 0;
	if (whatAmI === 'parent') {
		if (this.objectList.gizmoBox) { // There is a graph up
			width = this.objectList.gizmoBox.width;
			height = this.objectList.gizmoBox.height;
		}
		else {
			width = this.objectList.superBox.width / this.objectList.superBox.scale.x;
			height = this.objectList.superBox.height / this.objectList.superBox.scale.y;
		}
	}
	else {
		width = this.objectList.superBox.width / this.objectList.superBox.scale.x;
		height = this.objectList.superBox.height / this.objectList.superBox.scale.y
	}
	
	
	elem.beginFill(this.options.blockBgColor[0], 1);
	elem.drawRoundedRect(0, 0, width, height - this.objectList.foreG.position.y, 2);
	elem.endFill();
	
	if (whatAmI !== 'parent')
		this.objectList.foreG.texture = elem.generateTexture(renderer);
	
//	console.log(this.objectList.subContainer);
//	this.objectList.subContainer.alpha = 1;
//	$.each(this.objectList.subContainer.children, function(key, child) {
//		console.log(child.width);
//	});
	this.objectList.foreG.__type = 'foreG';
};

workflowGraph.prototype.resetForeG = function() {
	this.objectList.foreG.texture = PIXI.Texture.EMPTY;
};

workflowGraph.prototype.scaleFromDimensions = function(width, height) {
	return {x : this.defaultBoxDef.width / width, y : this.defaultBoxDef.height * this.options.superBoxHardScale.y / height}
}

workflowGraph.prototype.reDrawAll = function(durationBlockWidthFactor, targetHeight, progress) {
	var self = this, index, box, i = 0, max = Object.keys(this.objectList.boxes).length - 1;
	
	for (c = 0, l =  this.indexArray.length; c < l; c++) {
		index = this.indexArray[c];
		box = this.objectList.boxes[index];
		
		box.reDraw(box.savedWidth + ((box.duration * durationBlockWidthFactor * box.savedWidth - box.savedWidth) * progress), (box.savedHeight - (box.savedHeight - targetHeight) * progress));
		
		if (i == 0 || (box.handlesIn.length == 0 && box.handlesOut.length === 0)) {
			box.getAbsolutePosition();
		}
		i++;
	}
}

var workflowSuperGraph = function(options) {
	workflowGraph.call(this, options);
//	console.log(this.options);
};
workflowSuperGraph.prototype = Object.create(workflowGraph.prototype);
workflowSuperGraph.prototype.constructor = workflowSuperGraph;

workflowSuperGraph.prototype.init = function() {
	console.log('Mode : superGraph, Loaded graph ' + this.id + ' : ' + this.title);
	var self = this, subGraphDef;
	
	this.initGrid();

	this.objectList.superBoxes = {};
	this.objectList.superContainer = new PIXI.Container();

	this.superLoaded = 0;
	
	// Loop through the topGraph Def (or any superGraph Def if we're already in a recursion)
	for (var key in this.graphDef) {
		// Each def should define a box whith a superGraph inside
		if (this.graphDef[key].id.length > 0) {
			WG.multiGraphMode = true;
			
			var superGraph = new workflowSuperGraph({graphsPath : this.options.graphsPath});
			
			if (this.graphDef[key].type === 'superGraph')
				superGraph.__type = 'superGraph';
			else
				superGraph.__type = 'subGraph';
			
			superGraph.setOnLoaded(function(graph, key, title) {
				self.superLoaded++;
				self.prepareSuperGraph(graph, key, title);
			}, key, this.title);
			
			subGraphDef = graphLoader(this.graphDef[key].id, this.graphDef[key].title, this.options.graphsPath);
			
			if (typeof subGraphDef !== 'string') {
				superGraph.setAsyncGraphDef = subGraphDef;
			}
			else {
				superGraph.id = this.graphDef[key].id;
				superGraph.title = this.graphDef[key].title.replace(/\n/g, ' ');
				superGraph.rawGraphDef = subGraphDef;
				superGraph.prepareGraphDef();
			}
		}
	}
	if (WG.multiGraphMode !== true) {
		// Unique Graph creation
		this.createBoxObjects();
		
		this.createBg();
		this.objectList.superBox.alpha = 0;
		this.objectList.subContainer.alpha = 1; 	// Graph visible, although inside a superBox (will be showed progressively on connection with interact)
		this.objectList.superBox.scale = {x : .9, y : .9};
		this.objectList.superBox.removeChildAt(3); // no foreGround
		delete this.objectList.foreG
		this.objectList.superBox.title._text.alpha = 1;
		this.objectList.superBox.title._text.text = this.options.title; // Show Title right now
	}
};

workflowSuperGraph.prototype.prepareSuperGraph = function (graph, key, title) {
	var interact;
	
	// Waiting
	if (typeof loadingTextBlock !== 'undefined')
		loadingTextBlock.append($('<span/>').html('.'));
	
	// Child Graph creation
	graph.createBoxObjects();
	// create bg with the final dimensions
	graph.createBg();
	// don't create foreG here : it'd have the right dimensions and we want it with the samll size 
	// (we want it to have the same size as (subContainer.height + subContainer.position.y) => superBox height. foreG can't have influence on it)
	
	// Prepare parent graph superBoxes list (each superBox will be appended later to a gizmoBox)
	graph.objectList.superBox.title._text.text = (graph.options.title || graph.title).replace(/\n/g, ' ');
	this.objectList.superBoxes[key] = graph.objectList.superBox;
	this.objectList.superBoxes[key].subContainer = graph.objectList.subContainer;
	this.objectList.superBoxes[key].graph = graph;

	// Short circuit untill we have the superBoxes populated
	if (this.superLoaded !== this.superGraphNbr)
		return;
	
	// At this time, all the superBoxes (that needed it) are populated with a constructed graph
	
	// Top level Graph only : boxes have not been created yet
	if (this.options.masterGraph === true) {
		// Graph creation
		this.createBoxObjects();
		
		this.createBg();
		this.createForeG();
		this.objectList.superBox.alpha = 0;
		this.objectList.subContainer.alpha = 1; 	// Graph visible, although inside a superBox (will be showed progressively on connection with interact)
		this.objectList.superBox.scale = {x : 1.2, y : 1.2};
		this.objectList.superBox.removeChildAt(3); // no foreGround
		delete this.objectList.foreG
		this.objectList.superBox.title._text.alpha = 1;
		this.objectList.superBox.title._text.text = this.options.title; // Show Title right now
	}
	
	var self = this;
	// When the graph Defs are preloaded (i.e. populating the request cache before calling the constructor),
	// parsing the Def and creating the boxes takes more time than reaching the "finalize" step for the parent graph (TODO : investigate that...)
	// For now, let's give it a break...
		// Def is parsed 	// Boxes are over
	if (this.indexArray && Object.keys(this.objectList.boxes).length === this.indexArray.length)
		finalizeGraph.call(this);
	else
		setTimeout(function() {
			finalizeGraph.call(self);
		}, 00); 	// delay is >= 4 by default (https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setTimeout#Reasons_for_delays_longer_than_specified)
	
	function finalizeGraph() {
		// every Parent Graph
		for (c = 0; c < this.indexArray.length; c++) {
			var k = this.indexArray[c];
			var gizmoBox = this.objectList.boxes[k];

			gizmoBox.shape.__type = 'gizmoBox';
			
			// a constructed graph
			if (this.objectList.superBoxes[k]) {
				gizmoBox.shape.addChildAt(this.objectList.superBoxes[k], 1);
				gizmoBox.superBox = this.objectList.superBoxes[k];
				gizmoBox.superBox.graph.objectList.gizmoBox = gizmoBox;
				gizmoBox.boxType = gizmoBox._boxShape.type = 'evolved';
				gizmoBox.reDraw();
				
				// we have created the background with the right dimensions, it'll be then upscaled/downscaled by the animation (if first level = no developped box inside).
				// downscale here and transfer it to parent gizmoBox (it won't influence the superBox dimensions anymore)
				gizmoBox.superBox.children[0].width = gizmoBox.width;
				gizmoBox.superBox.children[0].height = gizmoBox.height - gizmoBox.superBox.children[0].position.y;
				gizmoBox.shape.addChildAt(gizmoBox.superBox.children[0], 1);
				// Create foreG after transfer : it'll have the definitive dimensions (undersized)
				gizmoBox.superBox.graph.createForeG();
				
				gizmoBox.superBox.width = this.defaultBoxDef.width;
				gizmoBox.superBox.height = this.defaultBoxDef.height;

				interact = new graphInteractions();
				interact.target = gizmoBox.superBox.children[2]
				interact.graph = gizmoBox.superBox.graph;
				interact.parentGraph = this;
				interact.id = gizmoBox.superBox.__id;
				interact.gizmoBox = gizmoBox;
				interact.addExpandableIcon();
				interact.connect();
				
				WG.interactListIndexes.push(gizmoBox.superBox.graph.id)
				if (!WG.interactList[gizmoBox.superBox.graph.id])
					WG.interactList[gizmoBox.superBox.graph.id] = interact;
			}
		}
	} 
};

workflowSuperGraph.prototype.finalStep = function () {
	stage.addChild(this.objectList.superBox);
	mainInteract.connect(this);
	console.log('some done');
};

workflowGraph.prototype.validateJSON = function(value) {
	var report;
	try {
		var result = jsonlint.parse(value);
		this.blocker = false;
	}
	catch(e) {
		console.log(e.message)
		this.blocker = true;
	}
	
	if (!this.blocker)
		return JSON.parse(value);
}