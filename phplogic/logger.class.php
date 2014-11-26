<?php

/**
 * Interface for logging, only supports one function.
 * Possible expansions:
 * - Log levels (info, debug, error etc.)
 * - Categories
 */
interface ILog
{
	public function Log($message);
}

/**
 * Our logging message consist of a message from the consumer, a timestamp (both in secs and ms)
 * and a stacktrace for where we were called from
 */
class LogMessage
{
	public $timestamp;
	public $microtime;
	public $message;
	public $stacktrace;
}

/**
 * Our stateless logger - poor thing only remembers thing for one request
 */
class StatelessLogger implements ILog
{
	private $messages = array();

	public function Log($message)
	{
		$log = new LogMessage();
		$log->message = $message;
		$log->stacktrace = debug_backtrace();
		$log->timestamp = time();
		$log->microtime = microtime(true);
		$this->messages[] = $log;
	}

	public function Read()
	{
		return $this->messages;
	}
}

// Here we only have one logger - so return it
return new StatelessLogger();