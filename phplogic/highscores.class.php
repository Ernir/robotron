<?php

class Highscore {
	public $id;
	public $name;
	public $score;
}

class Highscores {
	private $pdo;
	//private $logger;

	private $results = array();

	public function __construct($pdo) { /*, ILog $logger*/
		$this->pdo = $pdo;
		//$this->logger = $logger;
	}

	public function Insert($name, $score) {
		echo "insert";
		$name = strip_tags($name);
		$score = strip_tags($score);

		$this->pdo->exec(
			"CREATE TABLE IF NOT EXISTS highscores (
			id INTEGER PRIMARY KEY, 
			name TEXT, 
			score INTEGER)"
		);

		$query = $this->pdo->prepare("INSERT INTO highscores (name, score) VALUES (:name, :score)");
		$result = $query->execute(array('name' => $name, 'score' => $score));

		/*if (!$result) {
			//$this->logger->Log('Unable to insert item ' . $name .' with key '.$key.'. Error: '.print_r($this->pdo->errorInfo(), true));
			return false;
		}*/
	}

	public function Fetch() {
		echo "fetch";
		$query = $this->pdo->prepare("SELECT id, name, score FROM highscores");
		$result = $query->execute();
		
		if (!$result) {
			//$this->logger->Log('Unable to execute select for key '.$key.'. Error: '.print_r($this->pdo->errorInfo(), true));
			return array();
		}

		$data = $query->fetchAll(PDO::FETCH_ASSOC);

		if (!$data) {
			//$this->logger->Log('Unable to fetch results for '.$key);
			return array();
		}

		$results = array();

		foreach ($data as $row) {
			$hs = new Highscore();
			$hs->id = $row['id'];
			$hs->name = $row['name'];
			$hs->score = $row['score'];

			$results[] = $hs;
		}

		$this->results = $results;

		return $results;
	}

	public function Total() { return sizeof($this->results); }

	public function Results() { return $this->results; }
}