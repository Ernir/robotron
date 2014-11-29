<?php
require('highscores.class.php');
$method = $_SERVER['REQUEST_METHOD'];
$highscores = new Highscores(new PDO('sqlite:highscores.db'));
$results = array();

if ($method === 'POST') {
	if (isset($_GET['name']) && isset($_GET['score'])) {
		$highscores->Insert($_GET['name'], $_GET['score']);
		$highscores->ShowHighScores();
	}
}
?>