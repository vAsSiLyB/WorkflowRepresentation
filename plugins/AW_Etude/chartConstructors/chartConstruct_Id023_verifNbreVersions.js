statisticsChart.requestCache['Id023_verifNbreVersions'].initiator = function() {
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
				title : "Nombre de versions par programme",
				subTitle : "Programmes diffusés sur une période de 12 mois",
				desc : "",
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
				legendX : "Nbre versions / Progr",
				legendY1 : "Nbre Prog. recensés",
				legendY2 : "",
				uniteLegendMulti : "Unité de programmes",
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
	var nombres = ['', ' 1', ' 2', ' 3', ' 4', ' 5', ' 6', ' 7', ' 8'];
	var test = 0;
	
	var startDate = new Date('2014-09-01');
	var endDate = new Date('2015-08-31');
	
	var dataPresence = WG.planningDataRequestCache;
	
	var totalPresence = 0;
	$.each(WG.planningDataRequestCache, function(key, dayData) {
		totalPresence += dayData.effectif * 3600;
	});
	
	function getVerifDuration(indice, duree) {
		var sondageInterval = duree > 3600 ? 15 * 60 : 10 * 60;
		var verifDuree;
		switch (indice) {
			case 1 :
				verifDuree = Math.ceil(duree / sondageInterval) * 1.5 * 60;
				// TVGuide
				verifDuree += 10 * 60;
				break;
			case 2 :
				verifDuree = 3 * 1.5 * 60;
				break;
			case 3 :
				verifDuree = 3 * 1.5 * 60;
				break;
			case 4 :
				verifDuree = duree;
				// TVGuide
				verifDuree += 10 * 60;
				break;
			case 5 :
				verifDuree = Math.ceil(duree / sondageInterval) * 1.5 * 60;
				break;
		}
		
		
	}
	
	
	$.each(WG.baseDataRequestCache, function(emNbr, em) {
		
		var dernDiff = new Date(em["dernDiff"]);
		if ((em["dernDiff"] && (dernDiff.getTime() < startDate.getTime() || dernDiff.getTime() > endDate.getTime())) || !dernDiff)
			return;
		                         
		if ($.inArray(em.origine, listePoles) === -1 || !em.unite || !em.codeCaseDiff)
			return;
		
		var codeCaseDiff = em.codeCaseDiff.toString() + '_' + (/\//.test(em.nomCaseDiff) ? em.nomCaseDiff.replace(/\s([^/])/, '_$1').split('/')[0] : em.nomCaseDiff.replace(/\s([^/])/, '_$1'));
		var pole = em.origine, reclamImage = false;
		
		var versionNbr = 0, versionReclam = 0;
		
		var seenRediff = false, seenVI = false, versionNbr = 0;
		$.each(em.versions, function(index, version) {
			
			if (version.indice === 0)
				return;
			
			if (version.indice === 2)
				seenRediff = true;
			else if (version.indice === 5)
				seenVI = true;
			
			if ($.inArray(version.label, ['VAAUD', 'VFAUD', 'VOF-STMF', 'VF-STMF', 'VOA-STMA', 'VA-STMA']) !== -1)
					version.indice = 3;
			
			if (version.label.indexOf('STE') !== -1 || version.etat === 'B')
				return;
			
			versionNbr++;
		});
		
		if (seenVI && seenRediff)
			versionNbr--
			
			
		if (versionNbr === 5 && em.unite === 'CN')
			console.log(emNbr);
		
		versionNbr = nombres[versionNbr];
			
		if (typeof dataRoot[versionNbr] === 'undefined') {
			dataRoot[versionNbr] = {};
			Object.defineProperty(dataRoot[versionNbr], 'total', {
				writable : true, 	// enumerable : false by default
				value : 0
			});
			dataRoot.length++;
			dataRoot[versionNbr]['IN'] = [];
			dataRoot[versionNbr]['CF'] = [];
			dataRoot[versionNbr]['CT'] = [];
			dataRoot[versionNbr]['CN'] = [];
			dataRoot[versionNbr]['ANT'] = [];
		}
		
		versionType = dataRoot[versionNbr][em.unite];
		
		if (typeof versionType[em.codeCaseDiff] === 'undefined') {
			versionType.length++;
			versionType[em.codeCaseDiff] = {};
			versionType[em.codeCaseDiff].result = 0;
		}
		
		versionType[em.codeCaseDiff].infoBox = 'Case : ' + codeCaseDiff;
		versionType[em.codeCaseDiff].result++;
		dataRoot[versionNbr].total++;
	});
	
	var sortingArray = Object.keys(dataRoot);
	
	sortingArray.sort();
	var index;
	for (var i = 0, l = sortingArray.length; i < l; i++) {
		index = sortingArray[i].slice(0, 7);
		histoData.graphDef.gradX.labels.push(index);
	}
	
	histoData.graphDef.gradX.labels.reverse();
	
	console.log(histoData.abs.data);
	
	$.each(histoData.abs.data, function(key, cat) {
		console.log(key);
		if (cat.total > histoData.graphDef.maxY)
			histoData.graphDef.maxY = cat.total;
	});
	
	histoData.graphDef.maxX = histoData.graphDef.gradX.nbr = dataRoot.length;
	
	
	return histoData;	
}