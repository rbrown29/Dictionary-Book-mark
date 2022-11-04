<?php
define("DB_SERVER", "127.0.0.1");
define("DB_USER", "wordnet");
define("DB_PASSWORD", "wordnet");
define("DB_NAME", "wordnet");

header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *");

function lookup($con, $safe) {
	$sql = "";
	$sql .= "SELECT DISTINCT lemma ";
	$sql .= "FROM morphology ";
	$sql .= "WHERE morph = '".$safe."';";

	$result = mysqli_query($con, $sql);
	$words = [];
	while($row = mysqli_fetch_array($result)) {
		$words[] = $row[0];
	}

	$sql = "";
	$sql .= "SELECT lemma, pos, definition, sampleset ";
	$sql .= "FROM dict ";
	$sql .= "WHERE lemma = '".$safe."' ";
	for($i = 0; $i < count($words); $i++) {
		$sql .= "OR lemma = '".$words[$i]."' ";
	}
	$sql .= "ORDER BY lemma, pos ";
	$sql .= ";";

	$result = mysqli_query($con,$sql);

	$results = [];

	while($row = mysqli_fetch_assoc($result)) {
		$results[] = $row;
	}
	
	return $results;
}

$con = mysqli_connect(DB_SERVER, DB_USER, DB_PASSWORD, DB_NAME);
if (!$con) {
    die('Could not connect: ' . mysqli_error($con));
}

$safe = mysqli_real_escape_string($con, $_GET['word']);
mysqli_select_db($con, DB_NAME);

$results = lookup($con, $safe);
if(count($results) == 0) {
	if (substr($safe, -1) == 's') { // This is not very good, should check es -> "", and ies -> "y"
		$safe = substr($safe, 0, -1);
		$results = lookup($con, $safe);
	}
}
echo json_encode($results);
mysqli_close($con);
?>