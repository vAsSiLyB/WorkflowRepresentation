statisticsChart.requestCache['Id003_versionReclamRelative'].initiator = function() {
	// Histo
	var histoData = {
			id : "repartReclams",
			ord : {
			    data : {},
			    unit : "",
			    maxValue : 0
			},
			abs : {
			    data : {},
			    unit : ""
			},
			colorTable : [0x5f7fef, 0xFF5522, 0xF7AA5f, 0x8cef5f],
			graphDef : {
				type : "xy",
				subType : "histoMulti",
				title : "Balance des réclamations : Groupe Arte",
				subTitle : "Versions vérifiées sur une période de 12 mois, Volumes répartis par Pôle",
				desc : "Nombre de réclamations rapportées au volume des programmes livrés",
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
					nbr : 7,
					labels : []
				},
				legendX : "Fournisseur",
				legendY1 : "Nbre de versions",
				legendY2 : "",
				uniteLegendMulti : "Part dans le volume global",
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

	$.each(WG.baseDataRequestCache, function(emNbr, em) {
		                         
		if ($.inArray(em.origine, listePoles) === -1)
			return;
		
		var pole = em.origine, reclamImage = false;
		
		var versionNbr = 0, versionReclam = 0;
		$.each(em.versions, function(index, version) {
			if ((version.label.length <= 3 || $.inArray(version.label.indexOf('-'), [2, 3]) !== -1) 	// !== 'VFAUD', 'VAAUD'
					&& $.inArray(version.label.slice(0, 2), listeVersionsPole)
					&& version.label.indexOf('STE') === -1
					&& (version.fournisseurSon.length && version.fournisseurSon[0] === em.origine)) {
				versionNbr++;
				if (version.nbHistoR !== 0)
					versionReclam++;
			}
		});
		if (versionNbr === versionReclam)
			reclamImage = true;
		
//		if (emNbr === '057433-000-A')
//			return;
		
		var seenFirstVersion = false;
		$.each(em.versions, function(index, version) {
			
			if (version.fournisseurSon.length && $.inArray(version.fournisseurSon[0], listePoles) === -1)
				return;
			
			if ((version.fournisseurSon.length && version.fournisseurSon[0] === em.origine)
					&& ((version.fournisseurSt.length && version.fournisseurSt[0] !== em.origine) || !version.fournisseurSt.length)
					&& version.label.indexOf('STE') === -1
					&& $.inArray(version.label, ['VAAUD', 'VFAUD']) === -1) {

				if (typeof dataRoot[pole] === 'undefined') {
					dataRoot[pole] = {};
					dataRoot.length++;
					dataRoot[pole]['Reclam Audio ou ST'] = [];
					dataRoot[pole]['Reclam Video'] = [];
					dataRoot[pole]['Performance sup 96%'] = [];
					dataRoot[pole]['Version PAD'] = [];
				}
				if (reclamImage === true) {
					var reclam = dataRoot[pole]['Reclam Video'];
				}
				else {
					var reclam = dataRoot[pole]['Reclam Audio ou ST'];
				}
				var total = dataRoot[pole]['Version PAD'];
				
				if (typeof reclam['unique'] === 'undefined') {
					reclam['unique'] = [];
					reclam['unique'].result = 0;
					reclam['unique'].infoBox = 'Versions réclamées : ' + pole;
					total['unique'] = [];
					total['unique'].result = 0;
					total['unique'].infoBox = 'Versions acceptées : ' + pole;
				}
				
				total['unique'].result++; 
				
				if (seenFirstVersion === true && reclamImage === true)
					return false;
				
				if (version.nbHistoR !== 0) {
					reclam['unique'].result += Math.round(version.nbHistoR / 2);
					total['unique'].result--; 
				}
				
				dataRoot.max = dataRoot[pole]['Reclam Video'].unique ? dataRoot[pole]['Reclam Video'].unique.result + reclam['unique'].result + total['unique'].result : reclam['unique'].result + total['unique'].result;
				seenFirstVersion = true;
			}
		});
	});
	
//	$.each(dataRoot, function(key, pole) {
//		if ($.inArray(key, listePrestataires) === -1) {
//			delete dataRoot[key];
//			dataRoot.length--;
//		}
//	});
	
	var sortingArray = Object.keys(dataRoot);
//	console.log(sortingArray);
	sortingArray.sort();
	var index;
	for (var i = 0, l = sortingArray.length; i < l; i++) {
		index = sortingArray[i].slice(0, 6);
		histoData.graphDef.gradX.labels.push(index);
		
		var reclamSum = 0;
		if (dataRoot[sortingArray[i]]['Reclam Video']['unique'] && dataRoot[sortingArray[i]]['Reclam Audio ou ST']['unique'])
			reclamSum = dataRoot[sortingArray[i]]['Reclam Video']['unique'].result + dataRoot[sortingArray[i]]['Reclam Audio ou ST']['unique'].result;
		else if (dataRoot[sortingArray[i]]['Reclam Video']['unique'])
			reclamSum = dataRoot[sortingArray[i]]['Reclam Video']['unique'].result;
		else
			reclamSum = dataRoot[sortingArray[i]]['Reclam Audio ou ST']['unique'].result;
		console.log(sortingArray[i], reclamSum, reclamSum * 100 / dataRoot[sortingArray[i]]['Version PAD']['unique'].result);
		if (reclamSum * 100 / dataRoot[sortingArray[i]]['Version PAD']['unique'].result < 4) {
			dataRoot[sortingArray[i]]['Performance sup 96%'] = [];
			dataRoot[sortingArray[i]]['Performance sup 96%']['unique'] = [];
			dataRoot[sortingArray[i]]['Performance sup 96%']['unique'].result = dataRoot[sortingArray[i]]['Version PAD']['unique'].result;
			dataRoot[sortingArray[i]]['Performance sup 96%']['unique'].infoBox = 'Performance > 96% : ' + sortingArray[i];
			dataRoot[sortingArray[i]]['Version PAD']['unique'].result = 0;
		}
	}
	
	histoData.graphDef.gradX.labels.reverse();
	
	histoData.graphDef.maxY = dataRoot.maxValue;
	histoData.graphDef.gradY.nbr = 20;
	histoData.graphDef.maxX = histoData.graphDef.gradX.nbr = dataRoot.length;
	
	console.log(histoData.abs);
	
	return histoData;
}

//$(document).ready(function() {
//
//});