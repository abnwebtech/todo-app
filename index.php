<?php
	// Ignore static files when running local php 5.4 web server
	$sapi = php_sapi_name();
	$filename = __DIR__.preg_replace('#(\?.*)$#', '', $_SERVER['REQUEST_URI']);


	if ($sapi === 'cli-server' && is_file($filename)) {
		if (preg_match('/\.(?:json)$/', $_SERVER["REQUEST_URI"])) {
			header('Content-type: text/json');
			header('Content-type: application/json');
			echo file_get_contents($filename);
			exit;
		}
	    return false;
	}

$collection = file_get_contents('api/todos.json');

?>
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
	</head>
	<body>
		<h1>todos</h1>
		<script src="lib/jquery.js"></script>
		<script src="lib/underscore.js"></script>
		<script src="lib/backbone.js"></script>
		<script src="src/app.todo.js"></script>
		<script>
			$(function() {

				var todos, list;

				todos = new appTodo.TodosCollection();
				todos.fetch();

				list = new appTodo.TodoListView({
					collection: todos
				});

				$('body').append(list.el);

			});
		</script>
	</body>
<html>