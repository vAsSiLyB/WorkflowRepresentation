statisticsChart.requestCache['Id022_verifTempsDiff'].initiator = function() {
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
				title : "Temps moyen nécessaire pour une vérification",
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
					nbr : 9,
					labels : []
				},
				legendX : "Unité de programme",
				legendY1 : "Durée",
				legendY2 : "",
				uniteLegendMulti : "Unité de programmes",
				legendMulti : false,
				interactive : false
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
	
	var totalPresence = 0, totalVerif = 0;
	$.each(WG.planningDataRequestCache, function(key, dayData) {
		totalPresence += dayData.effectif * 3600 * 8;
	});
	
	console.log('totalPresence : ', totalPresence / 3600)
	
	function getVerifDuration(indice, duree) {
		var sondageInterval = duree > 3600 ? 15 * 60 : 10 * 60;
		var verifDuree = 0;
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
		
		return verifDuree;
	}
	
	var listeCasesGeneFin = [614, 204, 213, 215, 218];
	
	$.each(WG.baseDataRequestCache, function(emNbr, em) {
		
		var dernDiff = new Date(em["dernDiff"]);
		if ((em["dernDiff"] && (dernDiff.getTime() < startDate.getTime() || dernDiff.getTime() > endDate.getTime())) || !dernDiff)
			return;
		                         
		if ($.inArray(em.origine, listePoles) === -1 || !em.unite || !em.codeCaseDiff)
			return;
		
		var codeCaseDiff = em.codeCaseDiff.toString() + '_' + (/\//.test(em.nomCaseDiff) ? em.nomCaseDiff.replace(/\s([^/])/, '_$1').split('/')[0] : em.nomCaseDiff.replace(/\s([^/])/, '_$1'));
		var pole = em.origine, reclamImage = false;
		
		var versionNbr = 0, versionReclam = 0;
		
		var seenRediff = false, seenVI = false, versionNbr = 0, versionsSum = 10 * 60;
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
			
			versionsSum += getVerifDuration(version.indice, em.duree);
		});
		
		if (seenVI && seenRediff) {
			versionNbr--;
			versionsSum -= getVerifDuration(5, em.duree);
		}
		
		versionNbr = nombres[versionNbr];
		
		
		if ($.inArray(em.codeCaseDiff, listeCasesGeneFin) !== -1) {
			versionsSum += 20 * 60;
		}
		
//		console.log(versionsSum);
//		return false;
			
		if (typeof dataRoot[em.unite] === 'undefined') {
			dataRoot[em.unite] = {};
			Object.defineProperty(dataRoot[em.unite], 'total', {
				writable : true, 	// enumerable : false by default
				value : 0
			});
			dataRoot.length++;
			dataRoot[em.unite]['unique'] = [];
		}
		
		versionType = dataRoot[em.unite]['unique'];
		
		if (typeof versionType['unique'] === 'undefined') {
			versionType.length++;
			versionType['unique'] = {};
			versionType['unique'].result = [];
		}
		
//		versionType['unique'].infoBox = 'Case : ' + codeCaseDiff;
		versionType['unique'].result.push(versionsSum);
		versionType['unique'].result.sum += versionsSum;
		totalVerif += versionsSum;
		dataRoot[em.unite].total++;
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
		cat.unique.unique.result.average(0);
		cat.unique.unique.result = cat.unique.unique.result.avg / 60
		
		if (cat.unique.unique.result > histoData.graphDef.maxY)
			histoData.graphDef.maxY = cat.unique.unique.result;
	});
	
	histoData.graphDef.maxY = 90;
	
	histoData.graphDef.maxX = histoData.graphDef.gradX.nbr = dataRoot.length;
	
	console.log('totalVerif :', totalVerif / 3600);
	console.log(histoData.abs.data);
	
	return histoData;	
}