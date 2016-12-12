statisticsChart.requestCache['Id002_versionTypeCine'].initiator = function() {
	// Histo
	var histoData = {
			id : "repartVersions",
			ord : {
			    data : {},
			    unit : "",
			    maxValue : 0
			},
			abs : {
			    data : {
			    	STMA : {},
			    	STMF : {},
			    	AUDA : {},
			    	AUDF : {},
			    	VO : {}
			    },
			    unit : ""
			},
			colorTable : [],
			graphDef : {
				type : "xy",
				subType : "histoMulti",
				title : "Typologie des versions secondaires : Unité CF",
				subTitle : "Versions vérifiées sur une période de 12 mois",
				desc : "",
				graphY : "left", 	// "right", "dual"
				arrows : {x : false, y1 : true, y2 : false},
				minX : 0,
				maxX : 5,
				minY : 0,
				maxY : 100,
				gradX : {
					nbr : 5,
					labels : ['AUDA', 'AUDF', 'STMA', 'STMF', 'VM']
				},
				gradY : {
					nbr : 8.5,
					labels : []
				},
				legendX : "Types versions",
				legendY1 : "Nbre de versions vérifiées",
				legendY2 : "",
				uniteLegendMulti : "Unité de programme",
				legendMulti : false,
				interactive : true
			}
	};
	

//	var baseData = JSON.parse(data);
	
	var STMA = histoData.abs.data['STMA'];
	var STMF = histoData.abs.data['STMF'];
	var AUDA = histoData.abs.data['AUDA'];
	var AUDF = histoData.abs.data['AUDF'];
	var VO = histoData.abs.data['VO'];
	
	$.each(histoData.abs.data, function(key, cat) {
		Object.defineProperty(cat, 'length', {
			writable : true, 	// enumerable : false by default
			value : 0
		});
		Object.defineProperty(cat, 'total', {
			writable : true, 	// enumerable : false by default
			value : 0
		});
	});
	
	$.each(WG.baseDataRequestCache, function(emNbr, em) {
		if (em.unite !== "CF")
			return;
		
		var codeCase = em.codeCaseDiff || em.codeCaseConf;
		
		$.each(histoData.abs.data, function(cat, dataSet) {
			if (typeof dataSet[em.unite] === 'undefined') {
				dataSet[em.unite] = {};
				Object.defineProperty(dataSet[em.unite], 'total', {
					writable : true, 	// enumerable : false by default
					value : 0
				});
				dataSet.length++;
			}
		});
		
		var STMFu = STMF[em.unite];
		var STMAu = STMA[em.unite];
		var AUDAu = AUDA[em.unite];
		var AUDFu = AUDF[em.unite];
		var VOu = VO[em.unite];
		
		var seenVA = false;
		var seenVF = false;
		var needToCheckVA = false;
		var needToCheckVF = false;
		
		$.each(em.versions, function(key, version) {
			
			switch (version.label) {
				case 'VOA-STMA' :
				case 'VA-STMA' :
					if (typeof STMAu[codeCase] === 'undefined') {
						STMAu[codeCase] = {}
						STMAu[codeCase].result = 0;
						STMAu[codeCase].infoBox = em.nomCaseDiff;
					}

					STMAu[codeCase].result++;
					STMA.total++;
					STMAu.total++;
					seenVA = true;
					break;
				case 'VOF-STMF' :						
				case 'VF-STMF' : 
					if (typeof STMFu[codeCase] === 'undefined') {
						STMFu[codeCase] = {};
						STMFu[codeCase].result = 0;
						STMFu[codeCase].infoBox = em.nomCaseDiff;
					}
					STMFu[codeCase].result++;
					STMF.total++;
					STMFu.total++;
					seenVF = true;
					break;
				case 'VAAUD' :
					if (typeof AUDAu[codeCase] === 'undefined') {
						AUDAu[codeCase] = {};
						AUDAu[codeCase].result = 0;
						AUDAu[codeCase].infoBox = em.nomCaseDiff;
					}
					AUDAu[codeCase].result++;
					AUDA.total++;
					AUDAu.total++;
					break;
				case 'VFAUD' :
					if (typeof AUDFu[codeCase] === 'undefined') {
						AUDFu[codeCase] = {};
						AUDFu[codeCase].result = 0;
						AUDFu[codeCase].infoBox = em.nomCaseDiff;
					}
					AUDFu[codeCase].result++;
					AUDF.total++;
					AUDFu.total++;
					break;
				case 'VO-STF' :
				case 'VO-STA' : 
					if (typeof VOu[codeCase] === 'undefined') {
						VOu[codeCase] = {};
						VOu[codeCase].result = 0;
						VOu[codeCase].infoBox = em.nomCaseDiff;
					}
				case 'VO-STF' :
					if (version.etat !== 'Q')
						needToCheckVF = true;
					break;
				case 'VO-STA' : 
					if (version.etat !== 'Q')
						needToCheckVA = true;
					break;
			}
		});
		
		if (seenVA && needToCheckVA) {
			VOu[codeCase].result++;
			VO.total++;
			VOu.total++;
		}
		if (seenVF && needToCheckVF) {
			VOu[codeCase].result++;
			VO.total++;
			VOu.total++;
		}
	});
	
	$.each(histoData.abs.data, function(key, cat) {
		if (cat.total > histoData.ord.maxValue)
			histoData.ord.maxValue = cat.total;
	});
	histoData.graphDef.maxY = Math.round(histoData.ord.maxValue / 100) * 100;
	
//	console.log(histoData.abs);
	
	return histoData;
}

//$(document).ready(function() {
//
//});