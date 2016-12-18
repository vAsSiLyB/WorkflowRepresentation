var graphInteractions = function() {
	this.iState = {
		view : $('#main_canvas')
	}
};

graphInteractions.prototype.connect = function() {

	this.objectList = this.graph.objectList;
	this.init();
	
};

graphInteractions.prototype.init = function() {
	var self = this;
	
	this.subContainer = this.objectList.subContainer;
	this.bg = this.objectList.bg;
	this.superBox = this.objectList.superBox;
	
	this.b = new buttons();

	this.target.interactive = true;
	this.target.buttonMode = true;
	this.target.defaultCursor = "zoom-in";
	
	this.tempGridSave = this.graph.grid.rows.slice(0);
	
	// Define Timelines
	this.defineTimelines();

	
	// Graph Expansion timeline Actions
	
	// Hide GizmoBox Title
//	if (this.gizmoBox.titleContainer)
		this.blockExpand
			.to(this.gizmoBox.titleContainer, .25, {alpha : 0})
			.to(this.gizmoBox.expandableIcon, .25, {alpha : 0}, '-=.25');
		
	// Show superBox Title, expand superBox, expand background (background is required for stage panning), show background (bg upscale/downscale only first level : no developped box inside)
	this.blockExpand
		.to (this.superBox.title._text, .25, {alpha : 1})
		.to (this.superBox.scale, .25, {x : 1, y : 1}, '-=.25')
		.to (this.bg.scale, .25, {x : 1, y : 1}, '-=.25')
		.to (this.bg, .25, {alpha : 1}, '+=.25')
	// Show innerLink (this hasn't been downscaled)
	if (this.gizmoBox.innerLink) {
		for (var l = 0, len = this.gizmoBox.innerLink.length; l < len; l++) {
			this.blockExpand.to (this.gizmoBox.innerLink[l].shape, .25, {alpha : 1}, '-=.25')
		}
	}
	// at last, Show subContainer (movement is done on hidden elements : boxes upscaling isn't beautifull and anim speed may require this optimization)
	this.blockExpand.to (this.subContainer, .25, {alpha : 1}, '-=.25');

	
	// ClockMode timeline Actions
	
	this.clockMode
		.to(this.graph.options, .5, {defaultH_Interval : this.graph.options.clockMode.targetH_Interval})
		.to(this.graph.options.clockMode.currentTitlePosition, .5, {
			x : this.graph.options.clockMode.targetTitlePosition.x,
			y : this.graph.options.clockMode.targetTitlePosition.y}, '-=.5')
		.to(this.graph.options.clockMode, .2, {currentTitleRotation : this.graph.options.clockMode.targetTitleRotation}, '-=.5');
	
	
	// Click Events
	
	// Expand SubGraph on clicking the foreground
	this.target.on('mousedown', function(e) {
		self.target.on('mouseup', function(e) {
			if (self.superBox.developped === false){
				self.toggleExpand('expand');
			}
			else {
				self.toggleExpand();
			}
		});
		
		setTimeout(function() {
			self.target.removeListener("mouseup");
		}, 200);
	});

	if (this.graph.__type === 'topGraph')
		return;
	
	this.clockModeButton = this.b.createButton('toggle', "", {
		design : 'simpleBox',
		iconWidth : 35, 
		iconHeight : 36,
		position : {x : 0, y : 0}, 
		index : 3, 
		iconURL : relative + 'plugins/AW_Etude/images/clock_mode_icon_off.png',
		lineColor : 0x000000,
		fillColor : 0xFAFAFA
			});

	this.initClockModeButton();
	this.superBox.addChildAt(this.clockModeButton, this.clockModeButton.index);
};

graphInteractions.prototype.defineTimelines = function() {
	var self = this;
	// Define Timelines
	
	// Graph Expansion timeline Init
	
	this.blockExpand = new TimelineMax({
		paused : true,
		onStart : function() {
			self.target.defaultCursor = "grab";
		},
		onUpdate : function(object, timeline) {
			mainInteract.focusViewOn(object, timeline);
			self.gizmoBox.newWidth = self.superBox.width;
			self.gizmoBox.newHeight = self.superBox.height;
//			if (self.clockModeButton)
//				self.clockModeButton.position.x = self.gizmoBox.title.width + 21;

			if (self.parentGraph.objectList.gizmoBox) {
//				if (self.gizmoBox.graph.__type !== 'topGraph')
//					self.gizmoBox.graph.objectList.superBox.children[3].position.x = self.gizmoBox.graph.objectList.gizmoBox.title.width + 21;
				self.parentGraph.objectList.gizmoBox.newWidth = self.gizmoBox.graph.objectList.superBox.width;
				self.parentGraph.objectList.gizmoBox.newHeight = self.gizmoBox.graph.objectList.superBox.height;
				self.parentGraph.objectList.gizmoBox.graph.reDrawAll();
			}
			
			self.parentGraph.reDrawAll();
//			if (self.parentGraph.__type !== 'topGraph')
//				self.parentGraph.resetForeG();
//			self.parentGraph.createBg('parent');
			
			if (timeline.anti === true) {
				self.superBox.resting = true;
			}
			else
				self.superBox.expanding = true;
		},
		onUpdateParams : [self.target, '{self}'],
		onUpdateScope : mainInteract,
		onComplete : function() {
			this.target.defaultCursor = "zoom-out";

			this.parentGraph.createBg('parent');
			// in completion Callback : as foreG is inside the superBox and would influence the superBox bounds calculation if we update it on the fly
			this.parentGraph.createForeG();
			if (this.clockModeButton) {
//				this.clockModeButton.position.x = this.gizmoBox.width - (this.clockModeButton.width + 13);
				this.clockModeButton.alpha = .44
			}
			
			// Move foreGround to backGround
			if (this.graph.__type === 'topGraph' || this.graph.__type === 'superGraph')
				this.superBox.setChildIndex(this.target, 0);
			
			this.superBox.expanding = false;
			this.superBox.developped = true;
			
			if (this.parentGraph.objectList.gizmoBox) {

//				if (this.gizmoBox.graph.__type !== 'topGraph')
//					this.gizmoBox.graph.objectList.superBox.children[3].position.x = this.gizmoBox.graph.objectList.gizmoBox.width - (this.gizmoBox.graph.objectList.superBox.children[3].width + 13)
				this.parentGraph.objectList.superBox.resting = false;
				this.parentGraph.objectList.superBox.expanding = false;
			}
			
    		if (this.parentGraph.options.printMode === true) {
    			mainInteract.legend.alpha = 0;
    			renderer.resize(Math.ceil(mainGraph.objectList.superBox.width) + 101, Math.ceil(mainGraph.objectList.superBox.height) + 101);
    		}
    		
    		this.iconAnimation.beforeResume = function() {
    			delete this;
        		self.gizmoBox.expandableIcon.alpha = 0;
    		}
		},
		onCompleteScope : this,
		onReverseComplete : function() {
			this.target.defaultCursor = "zoom-in";
			
			this.parentGraph.createBg('parent');
			// in completion Callback : as foreG is inside the superBox and would influence the superBox bounds calculation if we update it on the fly
			this.parentGraph.createForeG('parent');
			if (this.clockModeButton) {
//				this.clockModeButton.position.x = this.gizmoBox.width - (this.clockModeButton.width + 13);
				this.clockModeButton.alpha = 0;
			}
			// Move foreGround to foreGround
			if (this.graph.__type === 'topGraph' || this.graph.__type === 'superGraph')
				this.superBox.setChildIndex(this.target, 2);
			
			this.superBox.resting = false;
			this.superBox.developped = false;
			
			if (self.parentGraph.objectList.gizmoBox) {
//				if (this.gizmoBox.graph.__type !== 'topGraph')
//					this.gizmoBox.graph.objectList.superBox.children[3].position.x = this.gizmoBox.graph.objectList.gizmoBox.width - (this.gizmoBox.graph.objectList.superBox.children[3].width + 13)
				this.parentGraph.objectList.superBox.resting = false;
				// Trick, TODO : find another way to add the margin on the parent gizmoBox 
				this.parentGraph.objectList.gizmoBox.newHeight = self.gizmoBox.graph.objectList.superBox.height;
				this.parentGraph.objectList.gizmoBox.graph.reDrawAll();
				this.parentGraph.objectList.superBox.expanding = false;
			}
			
			this.addExpandableIcon();
		},
		onReverseCompleteScope : this,
		smoothChildTiming : true
	});
	

	// clockMode timeline Init
	
	this.clockMode = new TimelineMax({
		paused : true,
		onStart : function() {
			self.tempGridSave = self.graph.grid.rows.slice(0);
			
			// Hide innerLink (refresh not needed)
			if (self.gizmoBox.innerLink) {
				self.gizmoBox.innerLink[0].shape.alpha = 0;
				self.gizmoBox.innerLink[1].shape.alpha = 0;
			}
		},
		onUpdate : function(object, timeline) {
			self.updateClockModeChange(timeline);
			self.graph.objectList.foreG.texture = PIXI.Texture.EMPTY; 
			self.graph.objectList.bg.texture = PIXI.Texture.EMPTY; 
			self.gizmoBox.newWidth = self.superBox.width;
			self.gizmoBox.newHeight = self.superBox.height;
			self.parentGraph.reDrawAll();
//			self.clockModeButton.position.x = self.gizmoBox.width - (self.clockModeButton.width + 13);
//			mainInteract.focusViewOn(object, timeline);
		},
		onUpdateParams : [self.target, '{self}'],
		onUpdateScope : this,
		onComplete : function(timeline) {
			// Update one last Time
			self.updateClockModeChange(timeline);
			self.clockMode.anti = true;

			// Emphasize warning textes
			$.each(self.objectList.boxes, function(key, box) {
				box.title.children[0].text = box.title.children[0].textOneLine; 
				box.title.children[2].text = box.title.children[2].textOneLine;
				if (box.subTask === 'warning') {
					box.title.children[0].style.fill = '#AA1100';
					box.title.children[2].style.fill = '#AA1100';
					box.title.rotation = 0;
					box.title.position = {x : 2, y : 2};
				}
			});

			self.graph.createBg('parent');
			self.graph.createForeG();
			self.parentGraph.reDrawAll();
			self.superBox.expanding = false;
			
//			self.clockModeButton.position.x = self.superBox.title.width + 12;
		},
		onCompleteScope : this,
		onCompleteParams : ['{self}'],
		onReverseComplete : function(timeline) {
			// Update one last Time
			self.updateClockModeChange(timeline);
			self.clockMode.anti = false;
			
			// Show innerLink (refresh not needed)
			if (self.gizmoBox.innerLink) {
				self.gizmoBox.innerLink[0].shape.alpha = 1;
				self.gizmoBox.innerLink[1].shape.alpha = 1;
			}
			
			// De-emphasize warning textes
			$.each(self.objectList.boxes, function(key, box) {
				box.title.children[0].text = box.title.children[0].textOriginal;
				box.title.children[2].text = box.title.children[2].textOriginal;
				box.title.children[0].style.fill = '#000000';
				box.title.children[2].style.fill = '#000000';
			});
			
			self.graph.createForeG();

			self.gizmoBox.newWidth = self.superBox.width;
			self.gizmoBox.newHeight = self.superBox.height;
			self.parentGraph.reDrawAll();
			
			self.graph.createBg('parent');
			
			self.superBox.resting = false;
			
//			self.clockModeButton.position.x = self.gizmoBox.width - (self.clockModeButton.width + 13);
		},
		onReverseCompleteScope : this,
		onReverseCompleteParams : ['{self}']
	});
}

graphInteractions.prototype.toggleExpand = function(expand) {
//	this.parentGraph.objectList.bg.alpha = 0;
	if (expand){
		this.superBox.expanding = true;
		if (this.gizmoBox.graph.objectList.gizmoBox)
			this.gizmoBox.graph.objectList.superBox.expanding = true;		
		this.blockExpand.anti = false;
		this.blockExpand.play();
		
	}
	else {
		this.superBox.expanding = false;
		// foreG is inside the superBox and will influence the superBox bounds calculation if we don't de-activate it
		if (this.parentGraph.objectList.foreG) // No foreG in the masterGraph, the bg is active
			this.parentGraph.objectList.foreG.texture = PIXI.Texture.EMPTY;
		if (this.gizmoBox.graph.objectList.gizmoBox)
			this.gizmoBox.graph.objectList.superBox.resting = true;
		this.blockExpand.anti = true;
		this.blockExpand.reverse();
		
	}
}

graphInteractions.prototype.initClockModeButton = function() {
	var self = this;
	
	// ClockMode Button
	this.clockModeButton.position.y = -2; 
	
	this.clockModeButton.children[0].on('mousedown', function(e) {
		if (self.clockModeButton.toggle == "off") {
			self.graph.options.clockMode.on = true;
			self.superBox.expanding = true;
			self.clockMode.anti = false;
			self.clockMode.play();
			
			self.superBox.removeChildAt(self.clockModeButton.index);
			self.clockModeButton = self.b.createButton('toggle', "", {
				design : 'simpleBox',
				iconWidth : 35, 
				iconHeight : 36,
				position : {x : 0, y : 0}, 
				index : 3,
				iconURL : relative + 'plugins/AW_Etude/images/clock_mode_icon_on.png',
				lineColor : 0x000000,
				fillColor : 0xF1F1F1
			});
			self.initClockModeButton();
			self.clockModeButton.alpha = 1;
			self.superBox.addChildAt(self.clockModeButton, self.clockModeButton.index);
			self.clockModeButton.toggle = "on"
		}
		else {
			self.graph.options.clockMode.on = false;
			self.superBox.resting = true;
			self.clockMode.anti = true;
			self.clockMode.reverse();

			self.superBox.removeChildAt(self.clockModeButton.index);
			self.clockModeButton = self.b.createButton('toggle', "", {
				design : 'simpleBox',
				iconWidth : 35, 
				iconHeight : 36,
				position : {x : 0, y : 0}, 
				index : 3,
				iconURL : relative + 'plugins/AW_Etude/images/clock_mode_icon_off.png',
				lineColor : 0x000000,
				fillColor : 0xFAFAFA
			});
			self.clockModeButton.alpha = 0;
			self.initClockModeButton();
			self.superBox.addChildAt(self.clockModeButton, self.clockModeButton.index);
			self.clockModeButton.toggle = "off"
		}
	});

	this.clockModeButton.position.x = this.superBox.title._text.width + 51;
	this.clockModeButton.alpha = 0;
	this.clockModeButton.children[0].on('mouseover', function(e) {
		this.parent.alpha = 1;
	});
	this.clockModeButton.children[0].on('mouseout', function(e) {
//		if (self.graph.options.clockMode.on !== true)
			this.parent.alpha = .44;
	});
};

graphInteractions.prototype.updateClockModeChange = function(timeline) {
	var p = timeline.anti === false ? timeline.progress() : 1 - timeline.progress();
	
	this.graph.options.variableAlpha = 1 - 2 * timeline.progress();
	
	for (var i = 0; i < this.graph.grid.rows.length; i++) {
		this.graph.grid.rows[i] = this.tempGridSave[i] + ((i === 0 || this.graph.__type === 'superGraph') ? this.graph.options.clockMode.gridOffset / 2.2 : this.graph.options.clockMode.gridOffset) * Math.min(1, (timeline.progress()) * 2);
	}
	this.graph.reDrawAll(this.graph.options.clockMode.durationBlockWidthFactor, this.graph.options.clockMode.targetBlockHeight, Math.min(1, (timeline.progress()) * 1));

};

graphInteractions.prototype.addExpandableIcon = function() {
	var self = this;
	this.gizmoBox.expandableIcon.textureOff = PIXI.Texture.fromImage(relative + 'plugins/AW_Etude/images/maximize_off.png');
	this.gizmoBox.expandableIcon.textureOn = PIXI.Texture.fromImage(relative + 'plugins/AW_Etude/images/maximize_on.png');
//	this.gizmoBox.expandableIcon.texture = this.gizmoBox.expandableIcon.textureOn;
	this.gizmoBox.expandableIcon.position = {x : this.gizmoBox.width - 24 , y : 5};
	this.gizmoBox.expandableIcon.scale = {x : .5, y : .5}
	this.gizmoBox.expandableIcon.alpha = .01;
	this.gizmoBox.expandableIcon.__type = 'expandableIcon';
	
	this.iconAnimation = new TimelineMax({
		onStart : function() {
			self.gizmoBox.expandableIcon.texture = self.gizmoBox.expandableIcon.textureOn;
		},
		paused : true
	});
	
	this.iconAnimation.beforeResume = function() {
		this.seek(0).play();
	}
	
	this.iconAnimation
		.to(this.gizmoBox.expandableIcon, 1.2, {ease : Power2.easeOut, alpha : .77})
		.to(this.gizmoBox.expandableIcon.scale, 1.2, {ease : Power2.easeOut, x : .7, y : .7}, '-=1.2')
		.to(this.gizmoBox.expandableIcon.position, 1.2, {ease : Power2.easeOut, x : this.gizmoBox.width - 27, y : 0}, '-=1.2')
		.addPause(1.2, resumeTimeline, [1.2])
		.play();
		
	function resumeTimeline(seconds) {
		TweenLite.to(self.gizmoBox.expandableIcon, .21, {alpha : .21, onComplete : function() {
			self.gizmoBox.expandableIcon.texture = self.gizmoBox.expandableIcon.textureOff;
		}});
//		self.gizmoBox.expandableIcon.scale = {x : .25, y : .25}
	    TweenLite.delayedCall(seconds, self.iconAnimation.beforeResume, null, self.iconAnimation);
	}
}

/**
 * STAGE INTERACTIONS
 */

var stageInteractions = function() {
};

stageInteractions.prototype.connect = function(graph) {
	this.iState = {
			view : $('#main_canvas')
	}
	this.graph = graph;
	this.objectList = this.graph.objectList;
	this.init();
};

stageInteractions.prototype.init = function() {
	var self = this;

	var target = this.bg = this.objectList.bg;
	target.interactive = true;
	target.buttonMode = true;
	target.defaultCursor = "grab";
	
	this.b = new buttons();
	
	this.superContainer = this.objectList.superBox;
	this.oldZoomValue = {x : .9, y : .9};
	
	this.zoomIntialState = this.graph.options.zoom;

	this.zoomFactor = {x : 1, y : 1};
	this.legendHeight = 38;

	this.superContainer.position = {x : this.iState.view.width() / 2 - (this.superContainer.width / this.superContainer.scale.x) / 2, y : (this.iState.view.height() - this.superContainer.height / this.superContainer.scale.y- this.legendHeight) / 2};

	var refPos = {x : this.iState.view[0].clientLeft, y : this.iState.view[0].clientTop};
	
	// Disable Right Click
	if (window.location.href.match(/print/) === null) {
		this.iState.view.on('contextmenu', function(e) {
			e.originalEvent.preventDefault();
	//		e.originalEvent.stopPropagation();
		});
	}
	
	// Viewport Panning
	target.on('mousedown', function(e) {
		self.panViewport(e, this);
	});
	// We introduced a delay in the graph creation corresponding to the (too long) time it takes to create the boxes
	// TODO : change that to a custom event
	setTimeout(function() {
		self.initPanModes();
	}, 64);

	// Zoom Slider
	if (!this.zoomSlider) {
		var labelValues = [50, 80, 100, 120, 200];
		var labels = [];
		for (var l = 50; l <= 200; l++) {
			if ($.inArray(l, labelValues) !== -1)
				labels.push(Number(l / 100).toString().slice(0, 3));
			else
				labels.push('');
		}

		this.zoomSlider = $('<div/>', {'class' : 'zoom_slider'}).appendTo(this.iState.view.parent()).slider({
			orientation : "vertical",
			range: false,
			min : .5,
			max : 2,
			step : .01,
			value : self.zoomIntialState || self.oldZoomValue.x,
			slide : function( event, ui ) {
				self.superContainer.scale = {x : ui.value, y : ui.value};
				self.zoomFactor = {x : ui.value / self.oldZoomValue.x, y : ui.value / self.oldZoomValue.y};
				self.focusViewOnCenter();
				if (self.graph.options.printMode === true)
					renderer.resize(Math.ceil(mainGraph.objectList.superBox.width) + 101, Math.ceil(mainGraph.objectList.superBox.height) + 101);
				self.oldZoomValue = {x : ui.value, y : ui.value};
			},
			change : function( event, ui ) {
				self.superContainer.scale = {x : ui.value, y : ui.value};
				self.zoomFactor = {x : ui.value / self.oldZoomValue.x, y : ui.value / self.oldZoomValue.y};
				self.focusViewOnCenter();
				self.oldZoomValue = {x : ui.value, y : ui.value};
			}
		})
		.slider("pips", {
			rest: "label",
			step : 10,
			labels : labels
		});
		this.zoomSlider.prepend(
				$('<div/>', {id : 'loop_container'})
					.append(
						$('<img/>', {src : relative + 'plugins/AW_Etude/images/loupe.png', width : '24px', height : '24px'})
					)
//				)
//				.append(
//					$('<div/>', {id : 'slider_pip', 'class' : 'pip08'}),
//					$('<div/>', {id : 'slider_pip', 'class' : 'pip09'}),
//					$('<div/>', {id : 'slider_pip', 'class' : 'pip1'}),
//					$('<div/>', {id : 'slider_pip', 'class' : 'pip12'})
		);
		
		if (typeof screenfull !== 'undefined' && !AW_diapos.testEspacePrive) {
			$('<img/>', {src : relative + 'plugins/AW_Etude/images/fullscreen.png', id : 'fullscreen_button'}).click(function(e) {
				e.originalEvent.preventDefault();
				e.originalEvent.stopPropagation();
	    		if (screenfull.enabled && !screenfull.isFullscreen)
	    			screenfull.request();
	    		else
	    			screenfull.exit();
	    	}).appendTo('body');
		}
	}
	
	if (!this.legend || !stage.children[2] || stage.getChildAt(2).__type !== 'masterLegend') {
		this.legend = this.createLegend();
	}
};

stageInteractions.prototype.animateHello = function() {
	var self = this;
	// Show Graphs progressively after loading
	TweenMax.to(this.superContainer, .5, {ease :  Power3.easeOut, alpha : 1, delay : .2});
	TweenMax.to(this.superContainer.scale, .84, {ease: Bounce.easeOut, x : this.oldZoomValue.x, y : this.oldZoomValue.y, 
		onStart : function() {
			self.setZoom();
		},
		onUpdate : function() {
//			self.focusViewOnCenter();
		},
		onComplete : function() {
//			self.superContainer.scale = zoomIntialState ? {x : zoomIntialState, y : zoomIntialState} : self.oldZoomValue;
		},
		delay : .2
	});
}

stageInteractions.prototype.setZoom = function() {
	this.oldZoomValue = this.zoomIntialState ? {x : 1, y : 1} : this.oldZoomValue;
	if (this.zoomIntialState)
		this.zoomSlider.slider('value', this.zoomIntialState);
}

stageInteractions.prototype.createLegend = function() {
	var self = this;
	var bg = this.b.createShape('containerBox', {x : 0, y : 0, width : this.iState.view.width(), height : this.legendHeight, fillColor : 0xFF7F7F7, lineColor : 0xEAEAEA});
	bg.position = {x : 0, y : this.iState.view.height() - this.legendHeight};
	bg.__type = 'masterLegend';
	stage.addChildAt(bg, 2);
	
	var margin = Math.min(77, Math.max(7, (this.iState.view.width() - 1600) / 3));
	var totalWidth = margin;
	
	var title1 = 'Qui ? ';
	var bgText = new PIXI.Text(title1, {font : '19px Fjalla One', fill : 0x555555});
	bg.addChild(bgText);
	bgText.position = {x : totalWidth, y : 7}
	totalWidth += graphUtils.stringWidthFromLength(title1, 'Fjalla One', '19px') + 21;

	$.each(this.graph.options.flowTaskHr, function(key, task){
		
		bgText = new PIXI.Text(task[1], {font : '29px Fjalla One', fill : 0x555555});
		
		var bgElem = new PIXI.Sprite();
		var texture = PIXI.Texture.fromImage(self.graph.options.icons[task[0]].url);
		bgElem.texture = texture;
		bgElem.scale = {x : .5, y : .5}
		bgElem.addChild(bgText);
		
		var width = graphUtils.stringWidthFromLength(task[1], 'Fjalla One', '15px ') + 38 + 21;
		bgText.position = {x : 44, y : 12};
		bgElem.position = {x : totalWidth, y : 2}
		totalWidth += width;
		bg.addChild(bgElem);
		
		if (key == 4) {
			var title2 = 'Comment ? ';
			bgText = new PIXI.Text(title2, {font : '19px Fjalla One', fill : 0x555555});
			totalWidth += margin - 38;
			bgText.position = {x : totalWidth, y : 7}
			bg.addChild(bgText);
			totalWidth += graphUtils.stringWidthFromLength(title2, 'Fjalla One', '19px') + 21;
		}
	});
	
	return bg;
};

stageInteractions.prototype.initPanModes = function() {
	var self = this;
	
	// loop through the graphical tree and look for all foreG objects
	for (var key in this.graph.objectList.subContainer.children) {
		if (this.graph.objectList.subContainer.children[key].__type === 'gizmoBox') {
			var superGraphElem = this.graph.objectList.subContainer.children[key];
			for (var k in superGraphElem.children) {
				if (superGraphElem.children[k].__type === 'superBox') {
					var child = superGraphElem.children[k];
					child.children[2].on('mousedown', function(e) {
						self.panViewport(e, this);
					});
					
					for (var ind in child.children[0].children) {
						if (child.children[0].children[ind].__type === 'gizmoBox') {
							var box = child.children[0].children[ind];
							for(var i in box.children) {
								if (box.children[i].__type === 'superBox') {
									box.children[i].children[2].on('mousedown', function(e) {
										self.panViewport(e, this);
									});
								}
							}
						}
					}
				}
			}
		}
	}
};

stageInteractions.prototype.initZoomButton = function() {
	var self = this;
	// Zoom Button
	
	this.zoomButton.children[0].on('mousedown', function(e) {
		if (self.zoomButton.toggle == "off") {
			self.superContainer.scale = {x : 1.2, y : 1.2};
			self.zoomFactor = {x : 1.2/.84, y : 1.2/.84};
			self.focusViewOnCenter();
			self.buttonContainer.removeChildAt(0);
			self.zoomButton = self.b.createButton('toggle', "Zoom -", {position : {x : 71, y : 0}, index : 0, design : 'heavy'});
			self.initZoomButton();
			self.buttonContainer.addChildAt(self.zoomButton, self.zoomButton.index);
    		if (self.graph.options.printMode === true) {
    			renderer.resize(Math.ceil(self.graph.objectList.superContainer.width) + 101, Math.ceil(self.graph.objectList.superContainer.height) + 101);
    		}
			self.zoomButton.toggle = "on"
		}
		else {
			self.superContainer.scale = {x : .84, y : .84};
			self.zoomFactor = {x : .84 / 1.2, y : .84 / 1.2}
			self.focusViewOnCenter();
			self.buttonContainer.removeChildAt(0);
			self.zoomButton = self.b.createButton('toggle', "Zoom +", {position : {x : 69, y : 0}, index : 0, design : 'heavy'});
			self.initZoomButton();
			self.buttonContainer.addChildAt(self.zoomButton, self.zoomButton.index);
    		if (self.graph.options.printMode === true) {
    			renderer.resize(Math.ceil(self.graph.objectList.superContainer.width) + 101, Math.ceil(self.graph.objectList.superContainer.height) + 101);
    		}
			self.zoomButton.toggle = "off"
		}
	});
}

stageInteractions.prototype.panViewport = function(e, target, accel) {
	var accel = accel || 1;
	var self = this;
	var data = e.data;

	var currentPos = self.superContainer.position;
	var clicked = data.getLocalPosition(stage);
//	self.container.defaultCursor = "all-scroll";
	self.iState.view.css('cursor','all-scroll');

	this.bg.on('mousemove', function(e) {
		self.superContainer.defaultCursor = "all-scroll";
		var current = data.getLocalPosition(stage);
		var offset = {x : current.x - clicked.x, y : current.y - clicked.y}
		self.superContainer.position = {x : currentPos.x + offset.x * accel, y : currentPos.y + offset.y * accel};
	});
	
	
	$(this.iState.view).on('mouseup', function(e) {
//			self.superContainer.defaultCursor = "all-scroll";
			self.superContainer.defaultCursor = "zoom-out";
			self.bg.removeListener("mousemove");
			self.currentGraphPosition = self.superContainer.position;
	});
};

stageInteractions.prototype.focusViewOn = function(object, timeline) {
	var p = typeof timeline !== 'undefined' ? (timeline.anti === false ? timeline.progress() : 1 - timeline.progress()) : 1;
	var objGlobal = object.toGlobal({x : 0, y : 0});
	var bounds = object.getBounds();
	var offset = {x : - objGlobal.x + this.iState.view.width() / 2  - (bounds.width) / 2 , y : - objGlobal.y + this.iState.view.height() / 2 - (bounds.height) / 2}
	this.superContainer.position = {x : this.superContainer.position.x + offset.x * Math.min(1, p * 2), y : this.superContainer.position.y + offset.y * Math.min(1, p * 2)};
};

stageInteractions.prototype.focusViewOnCenter = function() {
	var containerGlobal = this.superContainer.toGlobal({x : 0, y : 0});
	var currentCenter = {x : this.iState.view.width() / 2 - containerGlobal.x, y : this.iState.view.height() / 2 - containerGlobal.y};
//	console.log(currentCenter);
	var newCenter = {x : currentCenter.x * this.zoomFactor.x, y : currentCenter.y * this.zoomFactor.y}
	this.superContainer.position = {x : this.iState.view.width() / 2 - newCenter.x, y : this.iState.view.height() / 2 - newCenter.y};
}