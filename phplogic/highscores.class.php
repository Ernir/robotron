<?php

class Highscore {
	public $id;
	public $name;
	public $score;
}

class Highscores {
	private $pdo;
	private $results = array();

	public function __construct($pdo) {
		$this->pdo = $pdo; 
		$this->pdo->exec(
			"CREATE TABLE IF NOT EXISTS highscores (
			id INTEGER PRIMARY KEY, 
			name TEXT, 
			score INTEGER)"
		);
	}

	public function Insert($name, $score) {
		//Prevent injection.
		$name = strip_tags($name);
		$score = strip_tags($score);

		//Insert values
		$query = $this->pdo->prepare(
			"INSERT INTO highscores (name, score) 
			VALUES (:name, :score)"
		);
		$result = $query->execute(array('name' => $name, 'score' => $score));

		//If the table has more than 10 rows, delete the one with the lowest score
		$query = $this->pdo->prepare(
			"SELECT id, name, score 
			FROM highscores"
		);
		$result = $query->execute();
		$data = $query->fetchAll(PDO::FETCH_ASSOC);
		if (sizeof($data) > 10) {
			$query = $this->pdo->prepare(
				"DELETE FROM highscores 
				WHERE id=(
					SELECT MAX(id) 
					FROM highscores 
					WHERE score=(
						SELECT MIN(score) 
						FROM highscores
					)
				)"
			);
			$query->execute();
		}
	}

	public function ShowHighscores() {
		//Fetch the data in right order
		$query = $this->pdo->prepare(
			"SELECT id, name, score 
			FROM highscores 
			ORDER BY score 
			DESC LIMIT 10"
		);
		$result = $query->execute();

		//Return if it is failing
		if (!$result) {return;}
		$data = $query->fetchAll(PDO::FETCH_ASSOC);
		if (!$data) {return;}

		//Put the data in the result array as induvidual highscores.
		$results = array();
		foreach ($data as $row) {
			$hs = new Highscore();
			$hs->id = $row['id'];
			$hs->name = $row['name'];
			$hs->score = $row['score'];

			$results[] = $hs;
		}

		//Output it to the output div.
		if(isset($results)): ?>
			
			<section class="highscore">
				<h2 id="highscore">HIGHSCORE</h2>
				<article>
					<h3>Top 10 highscores</h3>
					<table id="highscoreList" class="highscoreList">
						<caption class="hidden">Highscore table</caption>
						<thead>
							<tr>
								<th scope="col">Rank</th>
								<th scope="col">Name</th>
								<th scope="col">Score</th>
							</tr>
						</thead>
						<tbody>
						<?php $i = 1; foreach ($results as $hs): ?>

							<tr><td><?php echo $i; ?></td><td><?php echo $hs->name ?></td><td><?php echo $hs->score ?></td></tr>
						<?php $i++; endforeach; ?>

						</tbody>
					</table>
				</article>
			</section>

		<?php endif;
	}
}