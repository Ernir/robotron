<!--
<hr style="clear:both; margin-top: 5em;">
<pre>
DEBUG:
<?php

/**
 * This takes care of printing debug information in the bottom of our output.
 * Each logged message is printed with information about where it originated
 * and how long it took.
 */

function stacktrace($s)
{
	foreach ($s as $line)
	{
		echo "\t".$line["class"].' in '.$line["file"].':'.$line["line"]."\n";
	}
}

// gives us the number of milliseconds between a and b
function timediff($a, $b)
{
	$diff = $a - $b;
	return number_format(($diff * 1000), 3);
}

$last = null;
$first = null;
foreach ($logger->Read() as $message)
{
	echo date("r", $message->timestamp);

	if ($first === null)
	{
		$first = $message->microtime;
	}

	if ($last !== null)
	{
		echo ' '.timediff($message->microtime, $last).' ms since last';
	}
	echo ' '.timediff($message->microtime, $first).' ms since first';
	echo "\n";
	$last = $message->microtime;

	echo $message->message . "\n";
	echo stacktrace($message->stacktrace) . "\n";
}
?>
</pre>
-->