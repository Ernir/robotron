<?php
require('highscores.class.php');
$method = $_SERVER['REQUEST_METHOD'];
$highscore = new Highscores(new PDO('sqlite:highscores.db'));

//$errors = array();
if ($method === 'POST') {
	if (isset($_GET['name']) && isset($_GET['score'])) {
		$highscore->Insert($_GET['name'], $_GET['score']);

		/*if (!$result)
		{
			$errors[] = 'Gat ekki búið til atriði '.$_POST['item'];
		}
		*/

		$highscore->Fetch();
	}
}
?>