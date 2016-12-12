statisticsChart.requestCache['Id002_versionReclamRelative'].initiator = function() {
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
				title : "Balance des réclamations : 2èmes versions",
				subTitle : "Versions vérifiées sur une période de 12 mois, Volumes répartis par Labo",
				desc : "Nombre de réclamations rapportées au volume des versions livrées",
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
	                  "ARTE PRODUCTION EXPLOITATION", "ARTE PRODUCTIONS", "ARTE STOCK COPIE", "CJI", "DEGETO"];
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

	$.each(WG.baseDataRequestCache, function(emNbr, em) {
		                         
//		if ($.inArray(em.origine, listePoles) !== -1)
//			return;
		
		
		// ne pas comptabiliser les reclamations vidéos ici : 
		// nous ne comptabilisons un programme sur s'il y a potentiellement une réclamation sur la "2ème version"
		var versionNbr = 0, versionReclam = 0;
		$.each(em.versions, function(index, version) {
			if ($.inArray(version.label, ['VAAUD', 'VFAUD']) === -1 	// !== 'VFAUD', 'VAAUD'
					&& version.label.indexOf('STE') === -1
					&& (version.fournisseurSon.length && version.fournisseurSon[0] === em.origine)) {
				versionNbr++;
				if (version.nbHistoR !== 0)
					versionReclam++;
			}
		});
		var reclamVideo = false;
		if (versionNbr === versionReclam)
			reclamVideo = true;
		
		if (emNbr === '057433-000-A')
			return;
		
		var prestataire, VADone = false, VFDone = false, VODone = false;		
		
		$.each(em.versions, function(index, version) {
			
			if (version.fournisseurSon.length && $.inArray(version.fournisseurSon[0], listePoles) !== -1)
				return;
			
			if (((version.label.slice(0, 2) === 'VA' && !VADone) || (version.label.slice(0, 2) === 'VF' && !VFDone))
					&& (version.fournisseurSon.length && version.fournisseurSon[0] !== em.origine)
					&& ((version.fournisseurSt.length && version.fournisseurSt[0] !== em.origine) || !version.fournisseurSt.length)
					&& $.inArray(version.fournisseurSon[0], listePoles) === -1) {
				prestataire = version.fournisseurSt[0] || version.fournisseurSon[0] || 'inconnu (probable achat Reclam ST VO GEIE)';

				if (typeof dataRoot[prestataire] === 'undefined') {
					dataRoot[prestataire] = {};
					dataRoot.length++;
					dataRoot[prestataire]['Reclam audio ou ST'] = [];
					dataRoot[prestataire]['Reclam ST VO'] = [];
					dataRoot[prestataire]['Version PAD'] = [];
					dataRoot[prestataire]['Performance sup 96%'] = [];
				}
				var reclam = dataRoot[prestataire]['Reclam audio ou ST'];
				var total = dataRoot[prestataire]['Version PAD'];
				if (typeof reclam['unique'] === 'undefined') {
					reclam['unique'] = [];
					reclam['unique'].result = 0;
					reclam['unique'].infoBox = 'Versions réclamées : ' + prestataire;
					total['unique'] = [];
					total['unique'].result = 0;
					total['unique'].infoBox = 'Versions acceptées : ' + prestataire;
				}
				if (version.nbHistoR !== 0 && !reclamVideo) {
					reclam['unique'].result += Math.round(version.nbHistoR / 2) || 1;
					total['unique'].result--; 
				}
				total['unique'].result++; 
				dataRoot.max = dataRoot[prestataire]['Reclam ST VO'].unique ? dataRoot[prestataire]['Reclam ST VO'].unique.result + reclam['unique'].result + total['unique'].result : reclam['unique'].result + total['unique'].result;
				
				if (version.label.slice(0, 2) === 'VA')
					 VADone = true;
				else if (version.label.slice(0, 2) === 'VF')
					 VFDone = true;
			}
			else if ((version.label.slice(0, 2) === 'VO' && !VODone) && version.indice === 4
					&&  $.inArray(version.fournisseurSt[0], listePoles) === -1
					&& (version.fournisseurSt.length && version.fournisseurSt[0] !== em.origine)) {
				prestataire = version.fournisseurSt[0] || 'inconnu (probable achat Reclam ST VO GEIE)';

				if (typeof dataRoot[prestataire] === 'undefined') {
					dataRoot[prestataire] = {};
					dataRoot.length++;
					dataRoot[prestataire]['Reclam audio ou ST'] = [];
					dataRoot[prestataire]['Reclam ST VO'] = [];
					dataRoot[prestataire]['Version PAD'] = [];
					dataRoot[prestataire]['Performance sup 96%'] = [];
				}
				var reclam = dataRoot[prestataire]['Reclam ST VO'];
				var total = dataRoot[prestataire]['Version PAD'];
				if (typeof reclam['unique'] === 'undefined') {
					reclam['unique'] = [];
					reclam['unique'].result = 0;
					reclam['unique'].infoBox = 'Versions réclamées : ' + prestataire;
					total['unique'] = [];
					total['unique'].result = 0;
					total['unique'].infoBox = 'Versions acceptées : ' + prestataire;
				}
				if (version.nbHistoR !== 0 && !reclamVideo) {
					reclam['unique'].result += Math.round(version.nbHistoR / 2) || 1;
					total['unique'].result--;
				}
				total['unique'].result++;
				dataRoot.max = dataRoot[prestataire]['Reclam audio ou ST'].unique ? dataRoot[prestataire]['Reclam audio ou ST'].unique.result + reclam['unique'].result + total['unique'].result : reclam['unique'].result + total['unique'].result;

				VODone = true;
			}
		});
	});
	
	$.each(dataRoot, function(key, prestataire) {
		var optST = prestataire['Reclam ST VO'].unique ? prestataire['Reclam ST VO'].unique.result : 0;
		var optAudio = prestataire['Reclam audio ou ST'].unique ? prestataire['Reclam audio ou ST'].unique.result : 0;
		
		if ($.inArray(key, listePrestataires) === -1) {
			delete dataRoot[key];
			dataRoot.length--;
		}
	});
	
	var sortingArray = Object.keys(dataRoot);
	console.log(sortingArray);
	sortingArray.sort();
	var index;
	for (var i = 0, l = sortingArray.length; i < l; i++) {
		index = sortingArray[i].slice(0, 2);
		histoData.graphDef.gradX.labels.push(index);
		
		var reclamSum = 0;
		if (dataRoot[sortingArray[i]]['Reclam ST VO']
			&& dataRoot[sortingArray[i]]['Reclam ST VO']['unique']
			&& dataRoot[sortingArray[i]]['Reclam audio ou ST']
			&& dataRoot[sortingArray[i]]['Reclam audio ou ST']['unique'])
			reclamSum = dataRoot[sortingArray[i]]['Reclam ST VO']['unique'].result + dataRoot[sortingArray[i]]['Reclam audio ou ST']['unique'].result;
		else if (dataRoot[sortingArray[i]]['Reclam ST VO'] && dataRoot[sortingArray[i]]['Reclam ST VO']['unique'])
			reclamSum = dataRoot[sortingArray[i]]['Reclam ST VO']['unique'].result;
		else if (dataRoot[sortingArray[i]]['Reclam audio ou ST'] && dataRoot[sortingArray[i]]['Reclam audio ou ST']['unique'])
			reclamSum = dataRoot[sortingArray[i]]['Reclam audio ou ST']['unique'].result;
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