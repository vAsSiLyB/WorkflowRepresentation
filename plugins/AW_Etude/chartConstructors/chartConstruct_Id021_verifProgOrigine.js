statisticsChart.requestCache['Id021_verifProgOrigine'].initiator = function() {
	// Histo
	var histoData = {
			id : "verifTypes",
			ord : {
			    data : {},
			    unit : "",
			    maxValue : 0
			},
			abs : {
			    data : {},
			    unit : ""
			},
			colorTable : [],
			graphDef : {
				type : "xy",
				subType : "histoMulti",
				title : "Répartition des origines des programmes (Hors Arte Info)",
				subTitle : "Origine des matériels reçus en Prédiffusion (pour diffusion sur une période de 12 mois)",
				desc : "",
				graphY : "dual", 	// "right", "dual"
				arrows : {x : false, y1 : true, y2 : false},
				minX : 0,
				maxX : 5,
				minY : 0,
				maxY : 7,
				minY2 : 0,
				maxY2 : 1700,
				gradX : {
					nbr : 25,
					labels : ['ARTE DE', 'ARTE DE ', 'ARTE FRANCE', 'ARTE FRANCE ', 'ARTE GEIE', 'ARTE GEIE ', 'GEIE PROD', 'GEIE PROD ']
				},
				gradY : {
					nbr : 8.5,
					labels : []
				},
				gradY2 : {
					nbr : 17,
					labels : []
				},
				legendX : "",
				legendY1 : "Nbre de Programmes",
				legendY2 : "Cumul durée (heures)",
				uniteLegendMulti : "Approche",
				legendMulti : true,
				interactive : true
			}
	};
	
	var dataRoot = histoData.abs.data;
	Object.defineProperty(dataRoot, 'length', {
		writable : true, 	// enumerable : false by default
		value : 0
	});
	Object.defineProperty(dataRoot, 'maxValue', {
		writable : true, 	// enumerable : false by default
		value : 0
	});
	Object.defineProperty(dataRoot, 'max', {
		set : function (newValue) {
			if (newValue > this.maxValue)
				this.maxValue = newValue;
		}
	});
	
	var listePoles = ["ARTE", "ARTE FRANCE", "BR", "HR", "MDR", "NDR", "RB", "RBB", "SR", "SWR", "WDR", "ZDF", 
	                  "ARTE PRODUCTIONS"];
	
	var listePolesDE = ["BR", "HR", "MDR", "NDR", "RB", "RBB", "SR", "SWR", "WDR", "ZDF"];
	
	var listePrestataires = [
	                         'ALIAS FILM & SPRACHTRANSFER',
	                         'AUDIOPHASE',
	                         'BERLINER SYNCHRON AG',
	                         'BOULEVARD DES PRODUCTIONS',
	                         'CINEPHASE',
	                         'CMC',
	                         'DMT',
	                         'DOME PRODUCTIONS',
	                         'ECLAIR GROUP PARIS',
	                         'ECLAIR MEDIA ALSACE',
	                         'GLOBE TV GMBH',
	                         'H.D. TONSTUDIO',
	                         'HAMBURGER SYNCHRON GMBH',
	                         'INNERVISION',
	                         'INTEROPA FILM',
	                         'IMAGINE',
	                         'KARINA FILMS',
	                         'KOLMER (CAT R. KOLMER GMBH)',
	                         'MEDIA TRANSFORM',
	                         'MFP',
	                         'NORDISCH FILMPRODUKTION ANDERSON + TEAM GMBH',
	                         'PARABOL PICTURES',
	                         'RGB',
	                         'RUTH MAI',
	                         'SEPPIA',
	                         'STUDIO 7',
	                         'STUDIO HAMBURG',
	                         'SUB & DUB COMPANY',
	                         'SUB-TIL',
	                         'TAUNUSFILM GMBH',
	                         'TEXT-TON-TITEL.DE',
	                         'TIMECODE FILMSTUDIO',
	                         'TV TEXT INTERNATIONAL',
	                         'UNTERTITEL WERKSTATT'
	                         ];
	                         
	var listePrestatairesOccasionnels = [
	                                'AVIDIA',
	                                'DOVIDIS',
	                                "DUB'CLUB",
	                                'DUBBING BROTHERS',
	                                'FFS',
	                                'NEUE TONFILM MÜNCHEN'
	                                ];
	
	var listeLabos = $.merge($.merge([], listePrestataires), listePrestatairesOccasionnels);
	
	var listeVersionsPole = ['VO', 'VA', 'VF', 'VI', 'VS'];
	
	var indices = ['', 'EP', 'Rediff', 'MAL AUD', 'INTEGR', 'VI VS'];
	var test = 0;
	
	$.each(histoData.graphDef.gradX.labels, function(index, label) {
		dataRoot[label] = {};
		dataRoot[label]['Nombre de Programmes'] = {};
		dataRoot[label]['Nombre de Programmes'].unique = {};
		dataRoot[label]['Nombre de Programmes'].unique.result = 0;
		dataRoot[label]['Durée cumulée'] = {};
		dataRoot[label]['Durée cumulée'].unique = {};
		dataRoot[label]['Durée cumulée'].unique.result = 0;
	});
	
	var dureeTotale = 0;
	var startDate = new Date('2014-09-01');
	var endDate = new Date('2015-08-31');
	
	var listeOriginesDebug = {};

	var listeDiversesOriginesGEIE = [
	                                 'ARTE',
	                                 'ARTE G.E.I.E.',
	                                 'ARTE HABILLAGE',
	                                 'ARTE INFO',
	                                 'ARTE PREDIFFUSION',
	                                 'ARTE PRODUCTION EXPLOITATION',
	                                 'ARTE PRODUCTION GEO',
	                                 'ARTE PRODUCTIONS',
	                                 'ARTE PRODUCTIONS EXECUTIVES',
	                                 'ARTE REPORTAGE',
	                                 'ARTE SQUARE',
	                                 'ARTE STOCK COPIE',
	                                 'LIVE',
	                                 'PREDIFFUSION'
	                                 ]
	var listeDiversesOriginesPolesDE = [
	                                    'RBB STANDORT POTSDAM'
	                                    ]
	
	
	listeOriginesDebug['_LABOS'] = {};
	listeOriginesDebug['_ARTE_DIVERS'] = {};
	
	var stop = 0;
	var corrections = {};
	
	$.each(WG.baseDataRequestCache, function(emNbr, em) {
		
		var dernDiff = new Date(em["dernDiff"]);
		if ((em["dernDiff"] && (dernDiff.getTime() < startDate.getTime() || dernDiff.getTime() > endDate.getTime())) || !dernDiff)
			return;
		
		if (em.origine === 'ARTE FRANCE' || em.origine === 'LIVE') {
			dataRoot['ARTE FRANCE']['Nombre de Programmes'].unique.result++;
			dataRoot['ARTE FRANCE ']['Durée cumulée'].unique.result += em.duree / 3600;
			if (dataRoot['ARTE FRANCE']['Nombre de Programmes'].unique.result > histoData.graphDef.maxY)
				histoData.graphDef.maxY = dataRoot['ARTE FRANCE']['Nombre de Programmes'].unique.result;
		}
		else if ($.inArray(em.origine, listePolesDE) !== -1) {
			dataRoot['ARTE DE']['Nombre de Programmes'].unique.result++;
			dataRoot['ARTE DE ']['Durée cumulée'].unique.result += em.duree / 3600;
			if (dataRoot['ARTE DE']['Nombre de Programmes'].unique.result > histoData.graphDef.maxY)
				histoData.graphDef.maxY = dataRoot['ARTE DE']['Nombre de Programmes'].unique.result;
		}
		else {
			dataRoot['ARTE GEIE']['Nombre de Programmes'].unique.result++;
			dataRoot['ARTE GEIE ']['Durée cumulée'].unique.result += em.duree / 3600;
			
			if ($.inArray(em.origine, listeLabos) !== -1) {
				if (typeof listeOriginesDebug['_LABOS'][em.origine] === 'undefined')
					listeOriginesDebug['_LABOS'][em.origine] = 0;
					
				listeOriginesDebug['_LABOS'][em.origine]++
			}
			else if ($.inArray(em.origine, listeDiversesOriginesGEIE) !== -1) {
				if (typeof listeOriginesDebug['_ARTE_DIVERS'][em.origine] === 'undefined')
					listeOriginesDebug['_ARTE_DIVERS'][em.origine] = 0;
					
				listeOriginesDebug['_ARTE_DIVERS'][em.origine]++;
				
				if (em.origine === 'ARTE') {
					var prodFound = false;
					$.each(em.versions, function(index, version) {
						if (version.fournisseurSon[0] === 'ARTE')
							prodFound = true;
					});
					if (prodFound) {
						dataRoot['ARTE GEIE']['Nombre de Programmes'].unique.result--;
						dataRoot['ARTE GEIE ']['Durée cumulée'].unique.result -= em.duree / 3600;
						dataRoot['GEIE PROD']['Nombre de Programmes'].unique.result++;
						dataRoot['GEIE PROD ']['Durée cumulée'].unique.result += em.duree / 3600;
//						console.log(emNbr);
					}
					
//					stop++;
//					
//					if (stop === 2)
//						return false;
				}
					
			}	
			else {
				if (typeof listeOriginesDebug[em.origine] === 'undefined')
					listeOriginesDebug[em.origine] = 0
			
				listeOriginesDebug[em.origine]++;
			}
			
			if (dataRoot['ARTE GEIE']['Nombre de Programmes'].unique.result > histoData.graphDef.maxY)
				histoData.graphDef.maxY = dataRoot['ARTE GEIE']['Nombre de Programmes'].unique.result;
		}
		
		dureeTotale += em.duree;
	});
	
	
//	document.body.innerHTML = JSON.stringify(WG.baseDataRequestCache);
	console.log(dureeTotale / 3600);
	
	
	var sortingArray = Object.keys(dataRoot);
	
	sortingArray.sort();
//	var index;
//	for (var i = 0, l = sortingArray.length; i < l; i++) {
//		index = sortingArray[i].slice(0, 7);
//		histoData.graphDef.gradX.labels.push(index);
//	}
	
	histoData.graphDef.gradX.labels.reverse();
	
//	$.each(histoData.abs.data, function(key, cat) {
//		if (cat.total > histoData.graphDef.maxY)
//			histoData.graphDef.maxY = cat.total;
//	});
	
	histoData.graphDef.maxX = histoData.graphDef.gradX.nbr = histoData.graphDef.gradX.labels.length;
	histoData.graphDef.maxY = 1700;
	
	console.log(histoData.abs.data);
	
	return histoData;	
}
