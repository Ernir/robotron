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
		$name = strip_tags($name);
		$score = strip_tags($score);
		$query = $this->pdo->prepare("INSERT INTO highscores (name, score) VALUES (:name, :score)");
		$result = $query->execute(array('name' => $name, 'score' => $score));
	}

	public function ShowHighscores() {
		$query = $this->pdo->prepare("SELECT id, name, score FROM highscores ORDER BY score DESC LIMIT 10");
		$result = $query->execute();
		if (!$result) { return array(); }
		$data = $query->fetchAll(PDO::FETCH_ASSOC);
		if (!$data) { return array(); }

		$results = array();

		foreach ($data as $row) {
			$hs = new Highscore();
			$hs->id = $row['id'];
			$hs->name = $row['name'];
			$hs->score = $row['score'];

			$results[] = $hs;
		}

		if(isset($results)): ?>
			
			<section class="highscore">
				<h1 id="highscore">HIGHSCORE</h1>
				<article>
					<ol class="highscoreList">
						<?php foreach ($results as $hs): ?>
						<li><?php echo "Name: ".$hs->name.". Score: ".$hs->score."." ?></li>
						<?php endforeach; ?>
					</ol>
				</article>
			</section>

		<?php endif;

		$this->results = $results;
		return $results;
	}

	public function Total() { return sizeof($this->results); }
	public function Results() { return $this->results; }
}