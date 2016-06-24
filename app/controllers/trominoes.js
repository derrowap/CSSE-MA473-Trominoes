'use strict';

angular.module('app.trominoes', []).
controller('trominoesCtrl', function($scope) {
	var trominoesCtrl = this; // allows functions to reference this controller's variables
	$scope.Math = window.Math; // allows angular expressions to use this now
	$scope.boardSize = 4; // size of the board in a power of two
	this.squareSize = 30; // pixel size of every square
	var movesDrawn = 0; // number of moves drawn on the board
	this.moves = []; // stores all of the moves in the order they were pushed
	this.currentOrientation = 'single'; // current orientation of a tile if a user clicked on the board
	this.speed = 2000 // controls the speed of solving. 2000 is fastest, 0 is slowest.

	// Data about all of the 4 different tromino orientations and the missing
	// square (or single) piece.
	this.trominoes = {
		'single': {
			'0': {
				'xOffset': 0,
				'yOffset': 0,
				'style': {
					'border': '2px solid black',
					'background-color': 'white',
					'width': trominoesCtrl.squareSize + 'px'
				}
			}
		},
		'bottomLeft': {
			'0': {
				'xOffset': 1,
				'yOffset': 0,
				'style': {
					'border': '2px solid black',
					'border-left': '0',
					'background-color': 'green',
					'width': trominoesCtrl.squareSize + 'px'
				}
			},
			'1': {
				'xOffset': 0,
				'yOffset': 0,
				'style': {
					'border-left': '2px solid black',
					'border-bottom': '2px solid black',
					'background-color': 'green',
					'width': trominoesCtrl.squareSize + 'px'
				}
			},
			'2': {
				'xOffset': 0,
				'yOffset': -1,
				'style': {
					'border': '2px solid black',
					'border-bottom': '0',
					'background-color': 'green',
					'width': trominoesCtrl.squareSize + 'px'
				}
			}
		},
		'topLeft': {
			'0': {
				'xOffset': 1,
				'yOffset': 0,
				'style': {
					'border': '2px solid black',
					'border-left': '0',
					'background-color': 'red',
					'width': trominoesCtrl.squareSize + 'px'
				}
			},
			'1': {
				'xOffset': 0,
				'yOffset': 0,
				'style': {
					'border-top': '2px solid black',
					'border-left': '2px solid black',
					'background-color': 'red',
					'width': trominoesCtrl.squareSize + 'px'
				}
			},
			'2': {
				'xOffset': 0,
				'yOffset': 1,
				'style': {
					'border': '2px solid black',
					'border-top': '0',
					'background-color': 'red',
					'width': trominoesCtrl.squareSize + 'px'
				}
			}
		},
		'bottomRight': {
			'0': {
				'xOffset': -1,
				'yOffset': 0,
				'style': {
					'border': '2px solid black',
					'border-right': '0',
					'background-color': 'blue',
					'width': trominoesCtrl.squareSize + 'px'
				}
			},
			'1': {
				'xOffset': 0,
				'yOffset': 0,
				'style': {
					'border-right': '2px solid black',
					'border-bottom': '2px solid black',
					'background-color': 'blue',
					'width': trominoesCtrl.squareSize + 'px'
				}
			},
			'2': {
				'xOffset': 0,
				'yOffset': -1,
				'style': {
					'border': '2px solid black',
					'border-bottom': '0',
					'background-color': 'blue',
					'width': trominoesCtrl.squareSize + 'px'
				}
			}
		},
		'topRight': {
			'0': {
				'xOffset': -1,
				'yOffset': 0,
				'style': {
					'border': '2px solid black',
					'border-right': '0',
					'background-color': 'yellow',
					'width': trominoesCtrl.squareSize + 'px'
				}
			},
			'1': {
				'xOffset': 0,
				'yOffset': 0,
				'style': {
					'border-right': '2px solid black',
					'border-top': '2px solid black',
					'background-color': 'yellow',
					'width': trominoesCtrl.squareSize + 'px'
				}
			},
			'2': {
				'xOffset': 0,
				'yOffset': 1,
				'style': {
					'border': '2px solid black',
					'border-top': '0',
					'background-color': 'yellow',
					'width': trominoesCtrl.squareSize + 'px'
				}
			}
		}
	}


	$scope.setupBoard = function () {
		/*
		Initializes a 2^n x 2^n deficient board. Called every time a new
		board needs to be displayed.
		*/
		trominoesCtrl.board = [];
		for (var i = 0; i < Math.pow(2, $scope.boardSize); i++) {
			trominoesCtrl.board[i] = [];
			trominoesCtrl.board[i].style = {
				'height': trominoesCtrl.squareSize + 'px'
			};
			for (var j = 0; j < Math.pow(2, $scope.boardSize); j++) {
				trominoesCtrl.board[i][j] = {
					'style': {
						'width': trominoesCtrl.squareSize + 'px',
						'background-color': 'grey',
						'border': '2px solid black'
					},
					'used': false
				};
			}
		}
	}

	$scope.setupBoard(); // sets the board up on first load

	// watches for when a user wants to change the size of the squares
	$scope.$watch(function () {return trominoesCtrl.squareSize;},
		function () {
			for (var i = 0; i < trominoesCtrl.board.length; i++) {
				trominoesCtrl.board[i].style.height = trominoesCtrl.squareSize + 'px';
				for (var j = 0; j < trominoesCtrl.board[i].length; j++) {
					trominoesCtrl.board[i][j].style.width = trominoesCtrl.squareSize + 'px';
				}
			}
		}
	);

	$scope.restartGame = function() {
		/*
		Restarts the game by re-initializing all the variables in a game
		instance. Called immediately when the Restart button on UI is pressed.
		*/
		movesDrawn = 0;
		trominoesCtrl.moves = [];
		$scope.error = null;
		$scope.setupBoard();
	};

	$scope.updateBoardSize = function(increase) {
		/*
		Increases or decreases the size of the board. Limits the possible
		sizes to between 2^1 x 2^1 to 2^6 x 2^6, or 2x2 to 64x64.
		*/
		if (increase && $scope.boardSize < 6) {
			$scope.boardSize++;
			$scope.restartGame();
		} else if (!increase && $scope.boardSize > 1) {
			$scope.boardSize--;
			$scope.restartGame();
		} else {
			$scope.error = "Allowed range for size of board is 2 to 64.";
		}
	};

	$scope.changeOrientation = function(orientation) {
		/*
		Changes the current orientation to the input. Called from the UI
		when a user selects an orientation on the radio inputs.
		*/
		trominoesCtrl.currentOrientation = orientation;
	}

	var drawMove = function(index) {
		/*
		Draws a move in trominoesCtrl.moves at the specified index.
		*/
		var move = trominoesCtrl.moves[index];
		var trominoPiece = trominoesCtrl.trominoes[move.orientation];

		$scope.$evalAsync(function() {
			for (var i = 0; i < Object.keys(trominoPiece).length; i++) {
				var spot = trominoPiece[i];
				var style = spot.style;
				style.width = trominoesCtrl.squareSize + 'px';
				trominoesCtrl.board[move.y + spot.yOffset][move.x + spot.xOffset].style = style;
				trominoesCtrl.board[move.y + spot.yOffset][move.x + spot.xOffset].used = true;
			}
		});
	};

	$scope.pushMove = function(col, row) {
		/*
		Pushes a move at the given col and row position with the current 
		orientation. This method is only used when a user is placing tiles by
		themself via clicking on the board. Will throw an error if it is an
		invalid move.
		*/

		// Check if this is a valid move
		var trominoPiece = trominoesCtrl.trominoes[trominoesCtrl.currentOrientation];
		for (var i = 0; i < Object.keys(trominoPiece).length; i++) {
			var spot = trominoPiece[i];
			var x = col + spot.xOffset;
			var y = row + spot.yOffset;
			if ((x < 0)
				|| (x >= Math.pow(2, $scope.boardSize))
				|| (y < 0)
				|| (y >= Math.pow(2, $scope.boardSize))
				|| (trominoesCtrl.board[y][x].used)) {
				$scope.error = "That tile does not fit here!";
				return;
			} 
		}
		if (trominoesCtrl.moves.length == 0 && trominoesCtrl.currentOrientation != 'single') {
			$scope.error = "You first must choose a missing square!";
			return;
		}
		if (trominoesCtrl.currentOrientation == 'single' && trominoesCtrl.moves.length != 0) {
			$scope.error = "You can only place one missing square, restart game if you want to move it.";
			return;
		}
		$scope.error = null; // remove error when a tile fits

		// push move to collection
		trominoesCtrl.moves.push({
			'x': col,
			'y': row,
			'orientation': trominoesCtrl.currentOrientation
		});

		// draw move
		drawMove(trominoesCtrl.moves.length - 1);
		movesDrawn++;
	};

	var baseCase = function(missingTile, missingSection) {
		/*
		In the base case when the board is a 2x2 deficient board, this pushes
		a move of the proper orientation at the proper location to fill the
		remaining space.
		*/
		switch (missingSection) {
			case 1:
				// draw bottom left tromino
				trominoesCtrl.moves.push({
					'x': missingTile.col - 1,
					'y': missingTile.row + 1,
					'orientation': 'bottomLeft'
				});
				break;
			case 2:
				// draw bottom right tromino
				trominoesCtrl.moves.push({
					'x': missingTile.col + 1,
					'y': missingTile.row + 1,
					'orientation': 'bottomRight'
				});
				break;
			case 3:
				// draw top right tromino
				trominoesCtrl.moves.push({
					'x': missingTile.col + 1,
					'y': missingTile.row - 1,
					'orientation': 'topRight'
				});
				break;
			case 4:
				// draw top left tromino
				trominoesCtrl.moves.push({
					'x': missingTile.col - 1,
					'y': missingTile.row - 1,
					'orientation': 'topLeft'
				});
		}
	};

	var jHelper = function(missingTile, xStart, xEnd, yStart, yEnd) {
		/*
		Implements the divide and conquer algorithm to tile a 2^n x 2^n 
		deficient board as described in the Johnsonbaugh paper.
		*/
		var missingSection = whichSection(missingTile, xStart, xEnd, yStart, yEnd);
		if (xEnd - xStart == 1) {
			// Base case
			baseCase(missingTile, missingSection);
			return;
		}
		switch (missingSection) {
			case 1:
				// missing square is in top right section
				// draw bottom left tromino
				var newX = Math.floor((xEnd + xStart) / 2);
				var newY = Math.floor((yEnd + yStart) / 2) + 1;
				trominoesCtrl.moves.push({
					'x': newX,
					'y': newY,
					'orientation': 'bottomLeft'
				});
				jHelper(missingTile, newX + 1, xEnd, yStart, newY - 1); // top right
				jHelper({'col': newX + 1, 'row': newY}, newX + 1, xEnd, newY, yEnd); // bottom right
				jHelper({'col': newX, 'row': newY}, xStart, newX, newY, yEnd); // bottom left
				jHelper({'col': newX, 'row': newY - 1}, xStart, newX, yStart, newY - 1); // top left
				break;
			case 2:
				// missing square is in the top left section
				// draw bottom right tromino
				var newX = Math.floor((xEnd + xStart) / 2) + 1;
				var newY = Math.floor((yEnd + yStart) / 2) + 1;
				trominoesCtrl.moves.push({
					'x': newX,
					'y': newY,
					'orientation': 'bottomRight'
				});
				jHelper(missingTile, xStart, newX - 1, yStart, newY - 1); // top left
				jHelper({'col': newX, 'row': newY - 1}, newX, xEnd, yStart, newY - 1); // top right
				jHelper({'col': newX, 'row': newY}, newX, xEnd, newY, yEnd); // bottom right
				jHelper({'col': newX - 1, 'row': newY}, xStart, newX - 1, newY, yEnd); // bottom left
				break;
			case 3:
				// missing square is in the bottom left section
				// draw top right tromino
				var newX = Math.floor((xEnd + xStart) / 2) + 1;
				var newY = Math.floor((yEnd + yStart) / 2);
				trominoesCtrl.moves.push({
					'x': newX,
					'y': newY,
					'orientation': 'topRight'
				});
				jHelper(missingTile, xStart, newX - 1, newY + 1, yEnd); // bottom left
				jHelper({'col': newX - 1, 'row': newY}, xStart, newX - 1, yStart, newY); // top left
				jHelper({'col': newX, 'row': newY}, newX, xEnd, yStart, newY); // top right
				jHelper({'col': newX, 'row': newY + 1}, newX, xEnd, newY + 1, yEnd); // bottom right
				break;
			case 4:
				// missing square is in the bottom right section
				// draw top left tromino
				var newX = Math.floor((xEnd + xStart) / 2);
				var newY = Math.floor((yEnd + yStart) / 2);
				trominoesCtrl.moves.push({
					'x': newX,
					'y': newY,
					'orientation': 'topLeft'
				});
				jHelper(missingTile, newX + 1, xEnd, newY + 1, yEnd); // bottom right
				jHelper({'col': newX, 'row': newY + 1}, xStart, newX, newY + 1, yEnd); // bottom left
				jHelper({'col': newX, 'row': newY}, xStart, newX, yStart, newY); // top left
				jHelper({'col': newX + 1, 'row': newY}, newX + 1, xEnd, yStart, newY); // top right
		}
	}

	var whichSection = function(missingTile, xStart, xEnd, yStart, yEnd) {
		/* 
		Helper function returns which section the missing tile is in, labeled
		the same as a Cartesian Plane, such that top right is 1, top left is 2,
		bottom left is 3, and bottom right is 4.
		*/
		if (missingTile.col <= Math.floor((xEnd + xStart) / 2)) {
			return (missingTile.row <= Math.floor((yEnd + yStart) / 2)) ? 2 : 3;
		} else {
			return (missingTile.row <= Math.floor((yEnd + yStart) / 2)) ? 1 : 4;
		}
	}

	function drawNextMove() {
		/*
		Draws the next move at index movesDrawn. Called in a user specified
		interval and when all the moves are drawn, it stops the interval from
		executing any further.
		*/
		if (trominoesCtrl.moves.length <= movesDrawn) {
			// all moves have been drawn
			clearInterval(trominoesCtrl.drawInterval);
			return;
		}
		drawMove(movesDrawn);
		movesDrawn++;
	}

	var tileLShape = function (xStart, xEnd, yStart, yEnd, orientation) {
		// Check for base case of L-Shape size of 1 tromino
		if (xEnd - xStart == 1) {
			switch (orientation) {
				case 'topRight':
					baseCase({'col': xStart, 'row': yEnd}, 3);
					break;
				case 'topLeft':
					baseCase({'col': xEnd, 'row': yEnd}, 4);
					break;
				case 'bottomLeft':
					baseCase({'col': xEnd, 'row': yStart}, 1);
					break;
				case 'bottomRight':
					baseCase({'col': xStart, 'row': yStart}, 2);
			}
			return;
		}

		switch (orientation) {
			case 'topRight':
				tileLShape(Math.ceil((3 * xStart + xEnd) / 4), Math.floor(3 * (xEnd - xStart) / 4) + xStart, Math.ceil((3 * yStart + yEnd) / 4), Math.floor(3 * (yEnd - yStart) / 4) + yStart, 'topRight');
				tileLShape(xStart, Math.floor((xStart + xEnd) / 2), yStart, Math.floor((yStart + yEnd) / 2), 'topLeft');
				tileLShape(Math.floor((xStart + xEnd) / 2) + 1, xEnd, yStart, Math.floor((yStart + yEnd) / 2), 'topRight');
				tileLShape(Math.floor((xStart + xEnd) / 2) + 1, xEnd, Math.floor((yStart + yEnd) / 2) + 1, yEnd, 'bottomRight');
				break;
			case 'topLeft':
				tileLShape(Math.ceil((3 * xStart + xEnd) / 4), Math.floor(3 * (xEnd - xStart) / 4) + xStart, Math.ceil((3 * yStart + yEnd) / 4), Math.floor(3 * (yEnd - yStart) / 4) + yStart, 'topLeft');
				tileLShape(xStart, Math.floor((xStart + xEnd) / 2), Math.floor((yStart + yEnd) / 2) + 1, yEnd, 'bottomLeft');
				tileLShape(xStart, Math.floor((xStart + xEnd) / 2), yStart, Math.floor((yStart + yEnd) / 2), 'topLeft');
				tileLShape(Math.floor((xStart + xEnd) / 2) + 1, xEnd, yStart, Math.floor((yStart + yEnd) / 2), 'topRight');
				break;
			case 'bottomLeft':
				tileLShape(Math.ceil((3 * xStart + xEnd) / 4), Math.floor(3 * (xEnd - xStart) / 4) + xStart, Math.ceil((3 * yStart + yEnd) / 4), Math.floor(3 * (yEnd - yStart) / 4) + yStart, 'bottomLeft');
				tileLShape(Math.floor((xStart + xEnd) / 2) + 1, xEnd, Math.floor((yStart + yEnd) / 2) + 1, yEnd, 'bottomRight');
				tileLShape(xStart, Math.floor((xStart + xEnd) / 2), Math.floor((yStart + yEnd) / 2) + 1, yEnd, 'bottomLeft');
				tileLShape(xStart, Math.floor((xStart + xEnd) / 2), yStart, Math.floor((yStart + yEnd) / 2), 'topLeft');
				break;
			case 'bottomRight':
				tileLShape(Math.ceil((3 * xStart + xEnd) / 4), Math.floor(3 * (xEnd - xStart) / 4) + xStart, Math.ceil((3 * yStart + yEnd) / 4), Math.floor(3 * (yEnd - yStart) / 4) + yStart, 'bottomRight');
				tileLShape(Math.floor((xStart + xEnd) / 2) + 1, xEnd, yStart, Math.floor((yStart + yEnd) / 2), 'topRight');
				tileLShape(Math.floor((xStart + xEnd) / 2) + 1, xEnd, Math.floor((yStart + yEnd) / 2) + 1, yEnd, 'bottomRight');
				tileLShape(xStart, Math.floor((xStart + xEnd) / 2), Math.floor((yStart + yEnd) / 2) + 1, yEnd, 'bottomLeft');
		}
	}

	var lHelper = function (missingTile, xStart, xEnd, yStart, yEnd) {
		console.log("lHelper", missingTile, xStart, xEnd, yStart, yEnd);
		if (xStart == xEnd) return; // base case when it is just the missing tile;
		var missingSection = whichSection(missingTile, xStart, xEnd, yStart, yEnd);
		var orientation = '';
		switch (missingSection) {
			case 1:
				// make deficient board top right, L-Shape bottom left
				lHelper(missingTile, Math.floor((xEnd + xStart) / 2) + 1, xEnd, yStart, Math.floor((yEnd + yStart) / 2));
				orientation = 'bottomLeft';
				break;
			case 2:
				// make deficient board top left, L-Shape bottom right
				lHelper(missingTile, xStart, Math.floor((xEnd + xStart) / 2), yStart, Math.floor((yEnd + yStart) / 2));
				orientation = 'bottomRight';
				break;
			case 3:
				// make deficient board bottom left, L-Shape top right
				lHelper(missingTile, xStart, Math.floor((xEnd + xStart) / 2), Math.floor((yEnd + yStart) / 2) + 1, yEnd);
				orientation = 'topRight';
				break;
			case 4:
				// make deficient board bottom right, L-Shape top left
				lHelper(missingTile, Math.floor((xEnd + xStart) / 2) + 1, xEnd, Math.floor((yEnd + yStart) / 2) + 1, yEnd);
				orientation = 'topLeft';
		}
		tileLShape(xStart, xEnd, yStart, yEnd, orientation);
	};

	this.startAlgorithm = function(isLShape) {
		/*
		Sets up the data needed to begin either the Johnsonbaugh algorithm or
		the L-Shape algorithm. Called immediately when one of the buttons are
		pressed on the UI.
		*/
		
		// check to make sure a missing square has been chosen
		if (trominoesCtrl.moves.length == 0) {
			$scope.error = "You first must choose a missing square!";
			return;
		}

		// erases all but missing square in case a user first tries to solve
		var firstMove = trominoesCtrl.moves[0];
		$scope.restartGame();
		trominoesCtrl.moves.push(firstMove);
		drawMove(0);

		var missingTile = {
			'col': trominoesCtrl.moves[0].x,
			'row': trominoesCtrl.moves[0].y
		};

		// begin the algorithm
		if (isLShape) {
			console.log("You chose the L-Shape algorithm.");
			lHelper(missingTile, 0, Math.pow(2, $scope.boardSize) - 1, 0, Math.pow(2, $scope.boardSize) - 1);
		} else {
			console.log("You chose the Johnsonbaugh algorithm.");
			jHelper(missingTile, 0, Math.pow(2, $scope.boardSize) - 1, 0, Math.pow(2, $scope.boardSize) - 1);
		}
		
		// Starts drawing the moves at the user specified speed
		trominoesCtrl.drawInterval = setInterval(drawNextMove, 2000 - trominoesCtrl.speed);
	}

});