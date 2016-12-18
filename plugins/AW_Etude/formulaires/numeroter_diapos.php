<?php

if (!defined('_ECRIRE_INC_VERSION')) return;


function formulaires_numeroter_diapos_charger_dist(){
	$valeurs = array();
	$valeurs['nouvelle_num'] = '';
	return $valeurs;
}


function formulaires_numeroter_diapos_verifier_dist(){
	return array();
}


function formulaires_numeroter_diapos_traiter_dist(){
	$retour['message_erreur']='';
	$retour['message_ok']='';
	$nouvelle_num=_request('nouvelle_num');
	foreach ($nouvelle_num as $num => $id) {
		$id=explode('_',$id);
		$num_donnee[$id[1]]=$num;
	}

	include_spip('action/attribuer_numeros_ordre');
	$res=attribuer_numeros_ordre($num_donnee);

	return $retour;
}


?>