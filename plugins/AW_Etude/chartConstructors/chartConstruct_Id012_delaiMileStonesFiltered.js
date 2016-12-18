statisticsChart.requestCache['Id012_delaiMileStonesFiltered'].initiator = function() {
	
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
				title : "Délai entre la livraison et la diffusion d'un programme",
				subTitle : "Résultats restreints aux programmes présentant une régularité (écarts inférieurs à 56)",
				desc : "Programmes vérifiés sur une période de 12 mois, Délai médian par cases de programmes, Hors programmation Eté",
				graphY : "right", 	// "right", "dual"
				arrows : {x : false, y1 : false, y2 : false},
				minX : 0,
				maxX : 0,
				minY : 0,
				maxY : 5,
				gradX : {
					nbr : 9,
					labels : []
				},
				gradY : {
					nbr : 5,
					labels : ['ANT', 'CF', 'CN', 'CT', 'IN']
				},
				legendX : "Durée Retrospective",
				legendY1 : "Unité",
				legendY2 : "",
				randomness : .77,
				interactive : true
			}
	};
	
	$.each(WG.baseDataRequestCache, function(emNbr, em) {
		var dernDiff = new Date(em.dernDiff);
		var summerTime = new Date('2015-07-01T00:00:00.000Z');
		if (em.unite === "" || !em.dernDiff || dernDiff.getTime() > summerTime.getTime() || em.duree < 300)
			return;
		
		var dateLivraison = new Date('2016-01-01T00:00:00.000Z');
		
		$.each(em.versions, function(key, version) {
			var candidate = new Date(version.dateLimiteVerif);
			if (version.dateLimiteVerif && candidate.getTime() < dateLivraison.getTime()) {
				dateLivraison = candidate;
			}
		});
		
		var diff = (dernDiff.getTime() - dateLivraison.getTime()) / (3600 * 24 * 1000) + 28;
		if (diff < 0)
			return;
//		if (em.codeCaseDiff === 708) {
//			console.log(emNbr, diff);
//		}
		var codeCaseDiff = em.codeCaseDiff.toString() + '_' + (/\//.test(em.nomCaseDiff) ? em.nomCaseDiff.replace(/\s([^/])/, '_$1').split('/')[0] : em.nomCaseDiff.replace(/\s([^/])/, '_$1'));
		
		var UN = histoData.ord.data[em.unite];
		if (typeof UN[codeCaseDiff] === 'undefined')
			UN[codeCaseDiff] = [];
		UN[codeCaseDiff].push(diff);
		UN[codeCaseDiff].members++;
		UN[codeCaseDiff].average(diff);
	});

	var maxValue = 0;
	$.each(histoData.ord.data, function(cat, dataSet) {
		$.each(dataSet, function(codeCase, result) {
			result.median();
			result.rmsCompute();
			if (result.rms > 56 || result.length < 5) {
				delete dataSet[codeCase];
				return;
			}
			if (result.md + 20 > maxValue)
				maxValue = result.md + 20;
		});
	});
	
	histoData.graphDef.maxX = maxValue;
//	console.log(histoData.ord.data.CN["829"]);
	
	return histoData;
}