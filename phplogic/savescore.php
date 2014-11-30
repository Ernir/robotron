<?php
require('highscores.class.php');
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
	if (isset($_GET['name']) && isset($_GET['score'])) {
		$highscores = new Highscores(new PDO('sqlite:highscores.db'));
		$highscores->Insert($_GET['name'], $_GET['score']);
		$highscores->ShowHighScores();
	}
}
?>