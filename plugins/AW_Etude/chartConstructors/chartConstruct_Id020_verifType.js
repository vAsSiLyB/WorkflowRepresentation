statisticsChart.requestCache['Id020_verifType'].initiator = function() {
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
				title : "Répartition des actions de vérification : après 3 ans de diffusion Tapeless à format constant",
				subTitle : "Versions vérifiées sur une période de 12 mois",
				desc : "Typologie des vérifications, pour base de l'évaluation horaire",
				graphY : "left", 	// "right", "dual"
				arrows : {x : false, y1 : true, y2 : false},
				minX : 0,
				maxX : 5,
				minY : 0,
				maxY : 7,
				gradX : {
					nbr : 25,
					labels : []
				},
				gradY : {
					nbr : 8.2,
					labels : []
				},
				legendX : "Type Vérification",
				legendY1 : "Nbre de versions",
				legendY2 : "",
				uniteLegendMulti : "Unités de programmes",
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
	                                'DOVIDIS',
	                                "DUB'CLUB",
	                                'FFS',
	                                'NEUE TONFILM MÜNCHEN'
	                                ];
	
	var listeVersionsPole = ['VO', 'VA', 'VF', 'VI', 'VS'];
	
	var indices = ['', 'EP', 'Rediff', 'MAL AUD', 'INTEGR', 'VI VS'];
	var test = 0;
	$.each(WG.baseDataRequestCache, function(emNbr, em) {
		                         
		if ($.inArray(em.origine, listePoles) === -1 || !em.unite || !em.codeCaseDiff)
			return;
		
		var codeCaseDiff = em.codeCaseDiff.toString() + '_' + (/\//.test(em.nomCaseDiff) ? em.nomCaseDiff.replace(/\s([^/])/, '_$1').split('/')[0] : em.nomCaseDiff.replace(/\s([^/])/, '_$1'));
		var pole = em.origine, reclamImage = false;
		
		var versionNbr = 0, versionReclam = 0;
		
		var seenRediff = false, seenVI = false;
		$.each(em.versions, function(index, version) {
			
			if (version.indice === 0)
				return;
			
			if (version.indice === 2)
				seenRediff = true;
			else if (version.indice === 5)
				seenVI = true;
			
			if ($.inArray(version.label, ['VAAUD', 'VFAUD', 'VOF-STMF', 'VF-STMF', 'VOA-STMA', 'VA-STMA']) !== -1)
					version.indice = 3;

			if (typeof dataRoot[indices[version.indice]] === 'undefined') {
				dataRoot[indices[version.indice]] = {};
				Object.defineProperty(dataRoot[indices[version.indice]], 'total', {
					writable : true, 	// enumerable : false by default
					value : 0
				});
				dataRoot.length++;
			}
			
			if (!dataRoot[indices[version.indice]][em.unite]) {
				dataRoot[indices[version.indice]][em.unite] = [];
			}
			
			versionType = dataRoot[indices[version.indice]][em.unite];
			
			if (typeof versionType[em.codeCaseDiff] === 'undefined') {
				versionType.length++;
				versionType[em.codeCaseDiff] = {};
				versionType[em.codeCaseDiff].result = 0;
				versionType[em.codeCaseDiff].infoBox = 'Case : ' + codeCaseDiff + ' / Type de Vérif : ' + indices[version.indice];
			}
			
			versionType[em.codeCaseDiff].result++;
			dataRoot[indices[version.indice]].total++;
		});
		if (seenVI && seenRediff)
			dataRoot['VI VS'][em.unite][em.codeCaseDiff].result--;
	});
	
	var sortingArray = Object.keys(dataRoot);
	
	sortingArray.sort();
	var index;
	for (var i = 0, l = sortingArray.length; i < l; i++) {
		index = sortingArray[i].slice(0, 7);
		histoData.graphDef.gradX.labels.push(index);
	}
	
	histoData.graphDef.gradX.labels.reverse();
	
	$.each(histoData.abs.data, function(key, cat) {
		if (cat.total > histoData.graphDef.maxY)
			histoData.graphDef.maxY = cat.total;
	});
	
	histoData.graphDef.maxX = histoData.graphDef.gradX.nbr = dataRoot.length;
	
	console.log(histoData.abs.data);
	
	return histoData;	
}