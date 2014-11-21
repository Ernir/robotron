<?php
require('highscores.class.php');
$method = $_SERVER['REQUEST_METHOD'];
$highscore = new Highscores(new PDO('sqlite:highscores.db'));

//$errors = array();
if ($method === 'POST') {
	echo "POSTED";
	foreach ($_POST as $bla):
		echo $bla;
	endforeach;
	if (isset($_POST['name']) && isset($_POST['score'])) {
		echo "ISSET";
		$highscore->Insert($_POST['name'], $_POST['score']);

		/*if (!$result)
		{
			$errors[] = 'Gat ekki búið til atriði '.$_POST['item'];
		}
		*/

		$highscore->Fetch();
	}
}
?>