<?php
/**
 * Utilisations de pipelines par Arte Workflow Etude
 *
 * @plugin     Arte Workflow Etude
 * @copyright  2016
 * @author     Sylvain Breil
 * @licence    GNU/GPL
 * @package    SPIP\aw_etude\Pipelines
 */

if (!defined('_ECRIRE_INC_VERSION')) return;


/*
 * Un fichier de pipelines permet de regrouper
 * les fonctions de branchement de votre plugin
 * sur des pipelines existants.
 */

function aw_etude_declarer_champs_extras($champs = array()) {
	$champs['spip_articles']['wgraph'] =  array(
			'saisie' => 'input',
			'options' => array(
					'nom' => 'wgraph',
					'label' => _T('aw_etude:CE_graph_label'),
					'sql' => 'varchar(64) NOT NULL DEFAULT "" ',
					'restrictions' =>array ('voir'=> array('auteur' => ''),
							'modifier' => array('auteur' => 'comite')

					)
			)
	);
	
	$champs['spip_articles']['wchart'] =  array(
			'saisie' => 'input',
			'options' => array(
					'nom' => 'wchart',
					'label' => _T('aw_etude:CE_chart_label'),
					'sql' => 'varchar(64) NOT NULL DEFAULT "" ',
					'restrictions' =>array ('voir'=> array('auteur' => ''),
							'modifier' => array('auteur' => 'comite')
	
					)
			)
	);
	
	$champs['spip_articles']['numero_ordre'] =  array(
			'saisie' => 'hidden',
			'options' => array(
					'nom' => 'numero_ordre',
					'label' => _T('aw_etude:CE_numero_ordre_label'),
					'sql' => 'bigint(32) NOT NULL DEFAULT "0" ',
					'restrictions' =>array ('voir'=> array('auteur' => ''),
							'modifier' => array('auteur' => 'comite')
	
					)
			)
	);
	
	return $champs;
}

// Définir le numéro d'ordre avant d'insérer (l'id_rubrique est connu ici)
function aw_etude_pre_insertion($flux){
	if ($flux['args']['table']=='spip_articles') {
		$numeros_ordre = sql_fetsel('MAX(numero_ordre)','spip_articles','id_rubrique = '.$flux['data']['id_rubrique']);
		$flux['data']['numero_ordre'] =	$numeros_ordre['MAX(numero_ordre)'] + 1;
	}
	return $flux;
}
// Retirer le numéro d'ordre fourni par le formulaire (il est toujours vide et le champ est invisible pour l'utilisateur)
function aw_etude_pre_edition($flux){
	if ($flux['args']['table']=='spip_articles') {
		unset($flux['data']['numero_ordre']);
	}
	return $flux;
}

/* pipeline pour typo */
function aw_etude_recuperer_fond($flux) {

	if ($flux['args']['fond'] === 'squelettes/diapo_JSON'){
// 		preg_match('#&lt;ul class=&quot;spip&quot;&gt;&lt;li&gt;&lt;ul class=&quot;spip&quot;&gt;&lt;li&gt;#', $flux['data']['texte'], $log);
		$flux['data']['texte'] = preg_replace('#&lt;ul class=&quot;spip&quot;&gt;&lt;li&gt;&lt;ul class=&quot;spip&quot;&gt;&lt;li&gt;#', '&lt;ul class=&quot;no_bullet&quot;&gt;&lt;li&gt;&lt;ul class=&quot;spip&quot;&gt;&lt;li&gt;', $flux['data']['texte']);
		
// 		spip_log($log, 'diapos'._LOG_INFO_IMPORTANTE);
// 		spip_log($t, 'diapos'._LOG_INFO_IMPORTANTE);
	}
	return $flux;
}

function aw_etude_header_prive($flux) {
	$flux.='<link rel="stylesheet" href="'.find_in_path('jquery-ui-slider-pips.css').'">';
	$flux.='<link rel="stylesheet" href="'.find_in_path('aw_etude_styles.css').'?timestamp='.time().'">';
	$flux.='<script type="text/javascript" src="'.find_in_path('js/jquery-ui-slider-pips.js').'"></script>';
	$flux.='<script type="text/javascript">
			var AW_diapos = {};
			AW_diapos.testEspacePrive = true;
			var stage, mainGraph, mainInteract, renderer, relative = "../";
	</script>';
	return $flux;
}

function aw_etude_insert_head_css($flux) {
	$flux.='<link rel="stylesheet" href="'.find_in_path('jquery-ui-slider-pips.css').'">';
	$flux.='<link rel="stylesheet" href="'.find_in_path('aw_etude_styles.css').'">';
	$flux.='<script type="text/javascript">
		var AW_diapos = {};
		AW_diapos.testEspacePrive = false;
		var stage, mainGraph, mainInteract, renderer, relative = "", waitingIncrement = true;
	</script>';

	return $flux;
}

function aw_etude_insert_head($flux) {
	$flux.='<script type="text/javascript" src="'.find_in_path('js/jquery-ui-slider-pips.js').'"></script>';
	return $flux;
}

// function aw_etude_insert_head($flux) {
// 	$flux='';
// 	return $flux;
// }

function aw_etude_jqueryui_plugins($flux) {
	$flux[]='jquery.ui.sortable';
	$flux[]='jquery.ui.slider';
	$flux[]='jquery.effects.core';
	return $flux;
}