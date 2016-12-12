<?php
/**
 * $num_donnee est un tableau de la forme array('constante'=> array('id_oeuvre'=>'numero_ordre'))
 * @param int $id_catalogue
 * @param int $id_oeuvre
 * @param array $num_donnee
 */
function attribuer_numeros_ordre($num_donnee=array()) {
	if (!empty($num_donnee)) {
		foreach ($num_donnee as $key => $value) {
			sql_update('spip_articles',array('numero_ordre'=>$value),'id_article='.$key);
		}

		return "";
	}
}
?>