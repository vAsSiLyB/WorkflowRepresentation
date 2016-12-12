statisticsChart.requestCache['Id012_delaiVerifCloud'].initiator = function() {
	
	// Cloud
	var histoData = {
			id : "nuage",
			ord : {
			    data : {
			    	IN : {},
			    	CT : {},
			    	CN : {},
			    	CF : {},
			    	ANT : {}
			    },
			    unit : ""
			},
			abs : {
			    data : {},
			    unit : "jours",
			    maxValue : 0
			},
			colorTable : [],
			graphDef : {
				type : "xy",
				subType : "cloud",
				width : 0,
				height : 0,
				title : "Délai entre la livraison et la diffusion d'un programme : livraison initiale",
				subTitle : "Programmes vérifiés sur une période de 12 mois, délai en nombre de jours précédant la diffusion",
				desc : "Délai par émission, 1ère version, différenciées selon que la production émane de la centrale ou d'un pôle",
				graphY : "right", 	// "right", "dual"
				arrows : {x : false, y1 : false, y2 : false},
				minX : 0,
				maxX : 0,
				minY : 0,
				maxY : 5,
				gradX : {
					nbr : 24,
					labels : []
				},
				gradY : {
					nbr : 5,
					labels : ['ANT', 'CF', 'CN', 'CT', 'IN']
				},
				legendX : "Durée Retrospective",
				legendY1 : "Unité",
				legendY2 : "",
				legendMulti : true
			}
	};
	
	$.each(histoData.ord.data, function(key, cat) {
		Object.defineProperty(cat, 'length', {
			writable : true, 	// enumerable : false by default
			value : 0
		});
		Object.defineProperty(cat, 'total', {
			writable : true, 	// enumerable : false by default
			value : 0
		});
	});

	var typeProd;
	
	$.each(WG.baseDataRequestCache, function(emNbr, em) {
		if (em.unite === "" || !em.dernDiff)
			return;
		
		var listePoles = ["ARTE FRANCE", "BR", "HR", "MDR", "NDR", "RB", "RBB", "SR", "SWR", "WDR", "ZDF"];
		if ($.inArray(em.origine, listePoles) === -1)
			typeProd = 'GEIE';
		else
			typeProd = "pole";
		
		$.each(histoData.ord.data, function(cat, dataSet) {
			if (typeof dataSet[typeProd] === 'undefined') {
				dataSet[typeProd] = [];
				Object.defineProperty(dataSet[typeProd], 'total', {
					writable : true, 	// enumerable : false by default
					value : 0
				});
				dataSet.length++;
			}
		});
		
		var INp = histoData.ord.data.IN[typeProd];
		var CTp = histoData.ord.data.CT[typeProd];
		var CNp = histoData.ord.data.CN[typeProd];
		var CFp = histoData.ord.data.CF[typeProd];
		var ANTp = histoData.ord.data.ANT[typeProd];
		
		var dateLivraison = new Date('2016-01-01T00:00:00.000Z');
		
		$.each(em.versions, function(key, version) {
			var candidate = new Date(version.dateLimiteVerif);
			if (version.dateLimiteVerif && candidate.getTime() < dateLivraison.getTime()) {
				dateLivraison = candidate;
			}
		});
		var dernDiff = new Date(em.dernDiff);
		var diff = (dernDiff.getTime() - dateLivraison.getTime()) / (3600 * 24 * 1000) + 28;
		if (diff < 0)
			return;
		
//		if (diff < 0) {
//			console.log(emNbr, em.titre,  'dernDiff', dernDiff, 'livraison', dateLivraison,diff);
//		}
		
		if (em.unite === 'IN') {
			if (Object.getOwnPropertyDescriptor(INp, 'max') === undefined) {
				Object.defineProperty(INp, 'max', {
					set : function (newValue) {
						if (newValue > this.max)
							this.max = newValue;
						if (newValue > histoData.abs.maxValue)
							histoData.abs.maxValue = newValue;
					}
				});
			}
			INp.push(diff);
			INp.max = diff;
		}
		else if (em.unite === 'CT') {
			if (Object.getOwnPropertyDescriptor(CTp, 'max') === undefined) {
				Object.defineProperty(CTp, 'max', {
					set : function (newValue) {
						if (newValue > this.max)
							this.max = newValue;
						if (newValue > histoData.abs.maxValue)
							histoData.abs.maxValue = newValue;
					}
				});
			}
//			console.log(em.titre, dateLivraison, dernDiff, diff);
			CTp.push(diff);
			CTp.max = diff;
		}
		else if (em.unite === 'CN') {
			if (Object.getOwnPropertyDescriptor(CNp, 'max') === undefined) {
				Object.defineProperty(CNp, 'max', {
					set : function (newValue) {
						if (newValue > this.max)
							this.max = newValue;
						if (newValue > histoData.abs.maxValue)
							histoData.abs.maxValue = newValue;
					}
				});
			}
			CNp.push(diff);
			CNp.max = diff;
		}
		else if (em.unite === 'CF') {
			if (Object.getOwnPropertyDescriptor(CFp, 'max') === undefined) {
				Object.defineProperty(CFp, 'max', {
					set : function (newValue) {
						if (newValue > this.max)
							this.max = newValue;
						if (newValue > histoData.abs.maxValue)
							histoData.abs.maxValue = newValue;
					}
				});
			}
			CFp.push(diff);
			CFp.max = diff;
		}
		else if (em.unite === 'ANT') {
			if (Object.getOwnPropertyDescriptor(ANTp, 'max') === undefined) {
				Object.defineProperty(ANTp, 'max', {
					set : function (newValue) {
						if (newValue > this.max)
							this.max = newValue;
						if (newValue > histoData.abs.maxValue)
							histoData.abs.maxValue = newValue;
					}
				});
			}
			ANTp.push(diff)
			ANTp.max = diff;
		}
	});
	
	histoData.graphDef.maxX = - histoData.abs.maxValue;
//	console.log(histoData.abs.maxValue);
	console.log(histoData.ord.data.CF.GEIE.max);
	
	return histoData;
}