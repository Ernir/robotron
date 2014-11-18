<?php
header('Content-Type: text/html; charset=utf-8');
ini_set('display_errors', 'on');
date_default_timezone_set('UTC');

include('views/header.php');
require('views/canvas.php');
include('views/main.php');
include('views/navbar.php');
include('views/footer.php');