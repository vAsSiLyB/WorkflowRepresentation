statisticsChart.requestCache['Id012_delaiVerifHistoZoomCF'].initiator = function() {
	
	// Cloud
	var histoData = {
			id : "nuage",
			ord : {
			    data : {
			    	CF : {}
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
				subType : "histoSpectrum",
				width : 0,
				height : 0,
				title : "Délai entre la livraison et la diffusion d'un programme : livraison initiale",
				subTitle : "Zoom sur les 60 derniers jours, unité CF, Hors programmation exceptionnelle",
				desc : "Délai différencé selon le type de programme Cinéma",
				graphY : "right", 	// "right", "dual"
				arrows : {x : false, y1 : false, y2 : false},
				minX : 0,
				maxX : 0,
				minY : 0,
				maxY : 5,
				gradX : {
					nbr : 12,
					labels : []
				},
				gradY : {
					nbr : 0,
					labels : ['14']
				},
				scaleY : 0.07,
				splitXpos : true,
				legendX : "Durée Retrospective",
				legendY1 : "Nbre PGM",
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

	var typeProd, listeCasesExcept = [298, 299, 398, 399];
	
	$.each(WG.baseDataRequestCache, function(emNbr, em) {
		if (em.unite !== "CF" || !em.dernDiff || $.inArray(em.codeCaseDiff, listeCasesExcept) !== -1)
			return;
		
		if (em.duree > 43 * 60)
			typeProd = 'Programmes_longs';
		else if (em.duree < 43 * 60 && em.duree > 3 * 60)
			typeProd = "Court_Metrages";
		else
			typeProd = "Habillage_CC_pastilles";
//			return;
		
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
		
		var CFp = histoData.ord.data.CF[typeProd];
		
		var dateLivraison = new Date('2016-01-01T00:00:00.000Z');
		
		$.each(em.versions, function(key, version) {
			var candidate = new Date(version.dateLimiteVerif);
			if (version.dateLimiteVerif && candidate.getTime() < dateLivraison.getTime()) {
				dateLivraison = candidate;
			}
		});
		var dernDiff = new Date(em.dernDiff);
		var diff = (dernDiff.getTime() - dateLivraison.getTime()) / (3600 * 24 * 1000) + 28;
		if (diff < 0 || diff > 60)
			return;
		
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
		if (!CFp[diff]) {
			CFp[diff] = 0;
		}
		CFp[diff]++;
		CFp.max = diff;
	});
	
	histoData.graphDef.maxX = - histoData.abs.maxValue;
//	console.log(histoData.abs.maxValue);
	console.log(histoData.ord.data.CF.Programmes_longs);
	
	return histoData;
}