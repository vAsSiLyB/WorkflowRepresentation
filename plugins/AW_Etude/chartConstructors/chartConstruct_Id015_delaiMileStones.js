statisticsChart.requestCache['Id015_delaiMileStones'].initiator = function() {
	
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
				desc : "Délai médian par cases de programmes, Ecart-type hors programmation Eté",
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
				randomness : .77,
				interactive : true,
				legendMulti : false
			}
	};
	
	$.each(WG.baseDataRequestCache, function(emNbr, em) {
		if (em.unite === "" || !em.dernDiff || em.dernDiff > '2015-07-01T00:00:00.000Z')
			return;
		
		var codeCaseDiff = em.codeCaseDiff.toString() + '_' + (/\//.test(em.nomCaseDiff) ? em.nomCaseDiff.replace(/\s([^/])/, '_$1').split('/')[0] : em.nomCaseDiff.replace(/\s([^/])/, '_$1'));
		
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
		if (diff < 0)
			return;
		
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
			if (result.median > maxValue)
				maxValue = result.median;
		});
	});
	
	histoData.graphDef.maxX = maxValue;
//	console.log(histoData.abs.maxValue);
	console.log(histoData.ord.data);
	
	return histoData;
}