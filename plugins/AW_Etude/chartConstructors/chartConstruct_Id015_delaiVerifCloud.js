statisticsChart.requestCache['Id015_delaiVerifCloud'].initiator = function() {
	
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
				title : "Délai entre la livraison de la 2ème version et la diffusion",
				subTitle : "Programmes vérifiés sur une période de 12 mois, délai en nombre de jours précédant la diffusion",
				desc : "Délai par émission, différenciés par cases de programmes",//, zoom sur les 100 derniers jours",
				graphY : "right", 	// "right", "dual"
				arrows : {x : false, y1 : false, y2 : false},
				minX : 0,
				maxX : 0,
				minY : 0,
				maxY : 5,
				gradX : {
					nbr : 20,
					labels : []
				},
				gradY : {
					nbr : 5,
					labels : ['ANT', 'CF', 'CN', 'CT', 'IN']
				},
				legendX : "Durée Retrospective",
				legendY1 : "Unité",
				legendY2 : "",
				interactive : true,
				legendMulti : false
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
		
		var codeCaseDiff = em.codeCaseDiff.toString();
		
		var dateLivraison = new Date('2016-01-01T00:00:00.000Z');
		
		$.each(em.versions, function(key, version) {
			if (version.label.slice(0, 2) === 'VA' || version.label.slice(0, 2) === 'VF') {
				var candidate = new Date(version.dateLimiteVerif);
				if (version.dateLimiteVerif && candidate.getTime() < dateLivraison.getTime()) {
					dateLivraison = candidate;
				}
			}
		});
		var dernDiff = new Date(em.dernDiff);
		var diff = (dernDiff.getTime() - dateLivraison.getTime()) / (3600 * 24 * 1000) + 28;
		if (diff < 0)// || diff > 100)
			return;
		
//		if (diff < 0) {
//			console.log(emNbr, em.titre,  'dernDiff', dernDiff, 'livraison', dateLivraison,diff);
//		}
		
		var UN = histoData.ord.data[em.unite];
		
		if (typeof UN[codeCaseDiff] === 'undefined') {
			UN[codeCaseDiff] = [];
			Object.defineProperty(UN[codeCaseDiff], 'max', {
				set : function (newValue) {
					if (newValue > this.max)
						this.max = newValue;
					if (newValue > histoData.abs.maxValue)
						histoData.abs.maxValue = newValue;
				}
			});
		}
		UN[codeCaseDiff].push(diff);
		UN[codeCaseDiff].max = diff;
		
	});
	
	histoData.graphDef.maxX = - histoData.abs.maxValue;
//	console.log(histoData.abs.maxValue);
//	console.log(histoData.ord.data.CF.GEIE);
	
	return histoData;
}