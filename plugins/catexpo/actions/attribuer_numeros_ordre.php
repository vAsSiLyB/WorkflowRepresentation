<?php

if (!function_exists('not_empty'))  {
	function not_empty($var) {return !empty($var);}
}

/**
 * $num_donnee est un tableau de la forme array('constante'=> array('id_oeuvre'=>'numero_ordre'))
 * @param int $id_catalogue
 * @param int $id_oeuvre
 * @param array $num_donnee
 */

function attribuer_numeros_inventaire($id_catalogue='',$id_oeuvre='',$update=false,$num_donnee=array()) {
	$retour='';
	
	list($oeuvres, $params)=attribuer_numeros_ordre($id_catalogue,$id_oeuvre,$num_donnee);
	
	if ($params['auto']) {
		foreach ($oeuvres as $id => $oeuvre) {
			// on a renuméroté : on met à jour (sur la base du numero "generation", c'est la référence) 
			$num_ordre=str_pad($oeuvre['numero'],$oeuvre['long'],'0',STR_PAD_LEFT);
			$num_inventaire=preg_replace('@[0-9]{'.$oeuvre['long'].'}@',$num_ordre,$oeuvre['generation']);
			$retour[$id]=$num_inventaire;
			
			if ($oeuvre['numero_inventaire']!=$num_inventaire) {
				if ($update===true) {
					sql_updateq('spip_oeuvres',array('numero_inventaire'=>$num_inventaire),'id_oeuvre='.$id);
					spip_log('nouveau numero attribué à l\'oeuvre '.$id.' : '.$num_inventaire);
				}
			}
		}
	}
	// Si on n'est pas en mode "auto", $retour est une chaine vide
	if (!empty($id_oeuvre) && is_array($retour)) return $retour[$id_oeuvre];
	else return $retour;
}

/**
 * $num_donnee est un tableau de la forme array('constante'=> array('id_oeuvre'=>'numero_ordre'))
 * @param int $id_catalogue
 * @param int $id_oeuvre
 * @param array $num_donnee
 */
function attribuer_numeros_ordre($id_catalogue='',$id_oeuvre='',$num_donnee=array()) {
	
	$nouveaux_numeros=array();

	list($oeuvres_par_critere,$anciens_numeros,$params)=trouver_numeros_ordre($id_catalogue,$id_oeuvre);
	if (!empty($num_donnee))
		$oeuvres_par_critere=$num_donnee;
	
	// On réinitialise et on met à jour
	foreach ($oeuvres_par_critere as $oeuvres_critere) {
		$prepa=array_flip(array_values(array_flip($oeuvres_critere)));
		$nouveaux_numeros=$prepa+$nouveaux_numeros;
		
		foreach ($prepa as $id => $numero) {
			// Pas de numero 0
			$numero=$numero+1;
			if ($numero!=$anciens_numeros[$id]['numero'])
				$anciens_numeros[$id]['numero']=$numero;
				sql_update('spip_oeuvres',array('numero_ordre'=>$numero),'id_oeuvre='.$id);
		}
	}
	$nouveaux_numeros=$anciens_numeros;

	return array($nouveaux_numeros,$params);
}

function trouver_numeros_ordre($id_catalogue='',$id_oeuvre='') {
	$params['bon_pour_confo']=false;
	$params['auto']=false;
	
	// Il faut parser sur l'id_catalogue : c'est plus lourd, mais on peut vérifier les doublons et les maximas des numéros d'ordre
	if (!intval($id_catalogue)) {
		$catalogue=sql_fetsel('id_catalogue','spip_oeuvres','id_oeuvre='.$id_oeuvre);
		$id_catalogue=$catalogue['id_catalogue'];
	}
	include_spip('action/parse_nomenclature');
	$oeuvres_infos=parse_nomenclature($id_catalogue);
	
	// On isole les éléments nécessaires : 
	// 1) l'index défini par la constante , l'id_oeuvre => L'actuel numéro d'ordre
	// 2) Le numero d'inventaire actuel à remplacer (ou le numero "generation" : cas de la création d'un objet) 
	// 3) dans le tableau $params : le nom complet de la / des constante(s) (qui servira pour l'affichage dans les squelettes)
	foreach($oeuvres_infos as $id => $oeuvre) {
		$constante=$oeuvre['nomenc_stricte']['masque_constante'];
		
		$anciens_numeros[$id]['numero_inventaire']=$oeuvre['numero_inventaire'];
		$anciens_numeros[$id]['conforme']=$oeuvre['conforme'];
		$anciens_numeros[$id]['normalized']=$oeuvre['normalized'];
		$anciens_numeros[$id]['generation']=$oeuvre['generation'];
		$anciens_numeros[$id]['numero']=$oeuvre['numero_ordre'];
		$anciens_numeros[$id]['long']=$oeuvre['nomenc_stricte']['numero_long'];
		$anciens_numeros[$id]['titre']=$oeuvre['titre']?$oeuvre['titre']:$oeuvre['titre_secret'];
		$anciens_numeros[$id]['date_real']=$oeuvre['date_real']?$oeuvre['date_real']:$oeuvre['date_estimee_debut'];
		$params[$constante]['constantes']=$oeuvre['nomenc_stricte']['constantes'];
		
		// Cas d'une oeuvre récemment créée : numero_ordre=0 (sera toujours le dernier de la liste)
		// Cas de doublons apparus accidentellement (lors de tests, ou ?) => on dédoublonne par sécurité
		if (is_array($oeuvres_par_critere[$constante]) && (!$oeuvre['numero_ordre'] || in_array($oeuvre['numero_ordre'],$oeuvres_par_critere[$constante]))) {
			arsort($oeuvres_par_critere[$constante]);
			$higher=reset($oeuvres_par_critere[$constante]);
			$oeuvre['numero_ordre']=$higher+1;
		}
		$oeuvres_par_critere[$constante][$id]=$oeuvre['numero_ordre'];
		asort($oeuvres_par_critere[$constante]);
		if($oeuvre['bon_pour_confo']) $params['bon_pour_confo']=true;
		if($oeuvre['auto']) $params['auto']=true;
	}
	$retour=array_merge(array($oeuvres_par_critere,$anciens_numeros),array($params));
	return $retour;
}
