<?php

class Todo
{
	public $id;
	public $title;
	public $finished;
	public $key;
}

class Todos
{
	private $pdo;
	private $logger;

	private $results = array();

	public function __construct($pdo, ILog $logger)
	{
		$this->pdo = $pdo;
		$this->logger = $logger;
	}

	/**
	 * Fyrir: Hlutur er með uppsettann $pdo hlut
	 * Eftir: Búið er að bæta við færslu með titil. Ef key er gefið var færslan búin til undir honum, annars var búinn til nýr lykill.
	 *        Skilar lykil sem færsla var búin til undir
	 */
	public function Insert($title, $key)
	{
		if ($key === '')
		{
			$key = uniqid();
		}

		$title = strip_tags($title);

		$this->pdo->exec(
			"CREATE TABLE IF NOT EXISTS Items (
			id INTEGER PRIMARY KEY, 
			title TEXT, 
			finished INTEGER, 
			key TEXT)"
		);

		$query = $this->pdo->prepare("INSERT INTO Items (title, finished, key) VALUES (:title, :finished, :key)");
		$result = $query->execute(array('title' => $title, 'finished' => '0', 'key' => $key, ));

		if (!$result)
		{
			$this->logger->Log('Unable to insert item ' . $title .' with key '.$key.'. Error: '.print_r($this->pdo->errorInfo(), true));
			return false;
		}

		return $key;
	}

	/**
	 * Fyrir: $key er sett sem lykill á færslum, $data er fylki með POST upplýsingum,
	 *        þar sem hugsanlega eru færslur sem heita "finished_X" þar sem X er auðkenni færslu sem á að klára
	 * Eftir: Búið er að merkja allar merktar færslur sem kláraðar, allar hinar sem ekki kláraðar
	 */
	public function UpdateFinished($key, $data)
	{
		if (sizeof($data) === 0)
		{
			return true;
		}

		$all = $this->Fetch($key);
		$finished = array();
		$not_finished = array();

		// search for all items that start with finish_
		foreach ($data as $item => $value)
		{
			if (strpos($item, 'finished_') === 0 && $value === 'finished')
			{
				$finished[] = substr($item, strlen('finished_'));
			}
		}

		foreach ($all as $item)
		{
			if (!in_array($item->id, $finished))
			{
				$not_finished[] = $item->id;
			}
		}

		foreach ($finished as $id)
		{
			$this->SetState(true, $id, $key);
		}

		foreach ($not_finished as $id)
		{
			$this->SetState(false, $id, $key);
		}

		return true;
	}

	/**
	 * Fyrir: $key er sett sem lykill á færslum, $data er fylki með POST upplýsingum,
	 *        þar sem hugsanlega eru færslur sem heita "delete_X" þar sem X er auðkenni færslu sem á að eyða
	 * Eftir: Búið er að eyða öllum færslum sem merktar voru
	 */
	public function DeleteItems($key, $data)
	{
		if (sizeof($data) === 0)
		{
			return true;
		}

		$delete = array();
		foreach ($data as $item => $value)
		{
			if (strpos($item, 'delete_') === 0 && $value === 'delete')
			{
				$delete[] = substr($item, strlen('delete_'));
			}
		}

		foreach ($delete as $id)
		{
			$this->logger->Log("Deleting $id...");
			if ($this->Delete($id, $key))
			{
				$this->logger->Log("$id deleted");
			}
		}

		return true;
	}

	/**
	 * Fyrir: $key er lykill sem sækja á færslur fyrir
	 * Eftir: Skilar fylki af Todo hlutum eða tóma fylkinu
	 */
	public function Fetch($key)
	{
		if (empty($key))
		{
			return array();
		}

		$query = $this->pdo->prepare("SELECT id, title, finished, key FROM Items WHERE key = :key");
		$result = $query->execute(array('key' => $key));
		
		if (!$result)
		{
			$this->logger->Log('Unable to execute select for key '.$key.'. Error: '.print_r($this->pdo->errorInfo(), true));
			return array();
		}

		$data = $query->fetchAll(PDO::FETCH_ASSOC);

		if ($data === false)
		{
			$this->logger->Log('Unable to fetch results for '.$key);
			return array();
		}

		$results = array();

		foreach ($data as $row)
		{
			$item = new Todo();
			$item->id = $row['id'];
			$item->title = $row['title'];
			$item->finished = $row['finished'] === '1';
			$item->key = $row['key'];

			$results[] = $item;
		}

		$this->results = $results;

		return $results;
	}

	/**
	 * Fyrir: Búið er að sækja færslur með Fetch
	 * Eftir: Skilar heildarfjölda færsla
	 */
	public function Total()
	{
		return sizeof($this->results);
	}

	/**
	 * Fyrir: Búið er að sækja færslur með Fetch
	 * Eftir: Skilar fjölda færsla sem búið er að klára
	 */
	public function Remaining()
	{
		$finished = 0;

		foreach ($this->results as $item)
		{
			if ($item->finished)
			{
				$finished++;
			}
		}

		return $this->Total() - $finished;
	}

	/**
	 * Fyrir: Búið er að sækja færslur með Fetch
	 * Eftir: Skilar niðurstöðum úr Fetch
	 */
	public function Results()
	{
		return $this->results;
	}

	/**
	 * Fyrir: key er lykill á færslu og id er auðkenni á færslu
	 * Eftir: Skilar true ef færslu var eytt en false annars
	 */
	private function Delete($id, $key)
	{
		$query = $this->pdo->prepare("DELETE FROM Items WHERE key = :key AND id = :id");
		$result = $query->execute(array('key' => $key, 'id' => $id));

		if (!$result)
		{
			$this->logger->Log('Unable to delete item ' . $id .' with key '.$key.'. Error: '.print_r($this->pdo->errorInfo(), true));
			return false;
		}

		return true;
	}

	/**
	 * Fyrir: state er bool fyrir stöðu á færslu, key er lykill á færslu og id er auðkenni á færslu
	 * Eftir: Skilar true ef færslu var merkt rétt en false annars
	 */
	private function SetState($state, $id, $key)
	{
		$finished = $state ? '1' : '0';

		$query = $this->pdo->prepare("UPDATE Items SET finished = :finished WHERE key = :key AND id = :id");
		$result = $query->execute(array('finished' => $finished, 'key' => $key, 'id' => $id));

		if (!$result)
		{
			$this->logger->Log('Unable to set state of item ' . $id .' with key '.$key.' to '.$state.'. Error: '.print_r($this->pdo->errorInfo(), true));
			return false;
		}

		return true;
	}
}