<?php
header('Content-Type: text/html; charset=utf-8');
ini_set('display_errors', 'on');
date_default_timezone_set('UTC');
/*
// Things we might want to change
const DEBUG = true;

require('phplogic/todos.class.php');

// Our dependencies
$logger = require('phplogic/logger.class.php');
$todos = new Todos(new PDO('sqlite:todos.db'), $logger);

// Track how long we're doing all of this
$logger->Log("Starting");

$key = isset($_GET['key']) ? strip_tags($_GET['key']) : '';

$errors = array();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST')
{
	if (!$todos->UpdateFinished($key, $_POST))
	{
		$errors[] = 'Gat ekki uppfært stöðu atriða!';
	}

	if (!$todos->DeleteItems($key, $_POST))
	{
		$errors[] = 'Gat ekki eytt atriðum!';
	}

	// new item was posted
	if (!empty($_POST['item']))
	{
		$result = $todos->Insert($_POST['item'], $key);

		if (!$result)
		{
			$errors[] = 'Gat ekki búið til atriði '.$_POST['item'];
		}
		else
		{
			$key = $result;
		}
	}

	// prevent form rebsubmission
	//header('Location: ?key='.$key);
}

// fetch all items, both previous and just saved
$todos->Fetch($key);
*/
//include('phplogic/savescore.php');
include('views/header.php');
require('views/canvas.php');
include('views/main.php');
include('views/navbar.php');
include('views/footer.php');
/*
$logger->Log('Finished');

if (DEBUG)
{
	include('views/debug.php');
}
*/