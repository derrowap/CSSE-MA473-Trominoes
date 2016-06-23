'use strict';

angular.module('app.trominoes', []).
controller('trominoesCtrl', function($scope) {
	var trominoesCtrl = this;
	$scope.Math = window.Math;
	$scope.boardSize = 4;
	this.squareSize = 30;
	var movesDrawn = 0;
	this.moves = [];
	this.currentOrientation = 'topLeft';

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

	$scope.setupBoard();
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
		movesDrawn = 0;
		trominoesCtrl.moves = [];
		$scope.setupBoard();
	};

	$scope.updateBoardSize = function(increase) {
		if (increase && $scope.boardSize < 5) {
			$scope.boardSize++;
			$scope.error = null;
			trominoesCtrl.moves = [];
			$scope.setupBoard();
		} else if (!increase && $scope.boardSize > 1) {
			$scope.boardSize--;
			$scope.error = null;
			trominoesCtrl.moves = [];
			$scope.setupBoard();
		} else {
			$scope.error = "Allowed range for size of board is 2 to 32.";
		}
	};

	$scope.changeOrientation = function(orientation) {
		trominoesCtrl.currentOrientation = orientation;
	}

	var drawMove = function(index) {
		console.log("drawMove", index, trominoesCtrl.moves[index]);
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
				|| (trominoesCtrl.board[x][y].used)) {
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
		console.log("updated moves:", trominoesCtrl.moves);

		// draw move
		drawMove(trominoesCtrl.moves.length - 1);
		movesDrawn++;
	};

	var baseCase = function(missingTile, missingSection) {
		switch (missingSection) {
			case 1:
				// draw bottom left
				trominoesCtrl.moves.push({
					'x': missingTile.col - 1,
					'y': missingTile.row + 1,
					'orientation': 'bottomLeft'
				});
				break;
			case 2:
				// draw bottom right
				trominoesCtrl.moves.push({
					'x': missingTile.col + 1,
					'y': missingTile.row + 1,
					'orientation': 'bottomRight'
				});
				break;
			case 3:
				// draw top right
				trominoesCtrl.moves.push({
					'x': missingTile.col + 1,
					'y': missingTile.row - 1,
					'orientation': 'topRight'
				});
				break;
			case 4:
				// draw top left
				trominoesCtrl.moves.push({
					'x': missingTile.col - 1,
					'y': missingTile.row - 1,
					'orientation': 'topLeft'
				});
				break;
		}
	};

	var jHelper = function(missingTile, xStart, xEnd, yStart, yEnd) {
		var missingSection = whichSection(missingTile, xStart, xEnd, yStart, yEnd);
		console.log("jHelper:", missingTile, xStart, xEnd, yStart, yEnd, missingSection);
		if (xEnd - xStart == 1) {
			// Base case
			baseCase(missingTile, missingSection);
			return;
		}
		switch (missingSection) {
			case 1:
				// draw bottom left tromino
				var newX = Math.floor((xEnd - xStart) / 2) + xStart;
				var newY = Math.floor((yEnd - yStart) / 2) + yStart + 1;
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
				// draw bottom right tromino
				var newX = Math.floor((xEnd - xStart) / 2) + xStart + 1;
				var newY = Math.floor((yEnd - yStart) / 2) + yStart + 1;
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
				// draw top right tromino
				var newX = Math.floor((xEnd - xStart) / 2) + xStart + 1;
				var newY = Math.floor((yEnd - yStart) / 2) + yStart;
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
				// draw top left tromino
				var newX = Math.floor((xEnd - xStart) / 2) + xStart;
				var newY = Math.floor((yEnd - yStart) / 2) + yStart;
				trominoesCtrl.moves.push({
					'x': newX,
					'y': newY,
					'orientation': 'topLeft'
				});
				jHelper(missingTile, newX + 1, xEnd, newY + 1, yEnd); // bottom right
				jHelper({'col': newX, 'row': newY + 1}, xStart, newX, newY + 1, yEnd); // bottom left
				jHelper({'col': newX, 'row': newY}, xStart, newX, yStart, newY); // top left
				jHelper({'col': newX + 1, 'row': newY}, newX + 1, xEnd, yStart, newY); // top right
				break;
		}
	}

	var whichSection = function(missingTile, xStart, xEnd, yStart, yEnd) {
		/* Helper function returns which section the missing tile is in, labeled
		the same as a Cartesian Plane, such that top right is 1, top left is 2,
		bottom left is 3, and bottom right is 4. */
		// console.log(missingTile, xStart, xEnd, yStart, yEnd);
		if (missingTile.col <= Math.floor((xEnd - xStart) / 2) + xStart) {
			return (missingTile.row <= Math.floor((yEnd - yStart) / 2) + yStart) ? 2 : 3;
		} else {
			return (missingTile.row <= Math.floor((yEnd - yStart) / 2) + yStart) ? 1 : 4;
		}
	}

	/* Johnsonbaugh Algorithm */
	this.tileJohnsonbaugh = function() {
		console.log("You chose the Johnsonbaugh algorithm.");
		var missingTile = {
			'col': trominoesCtrl.moves[0].x,
			'row': trominoesCtrl.moves[0].y
		};
		console.log("missing tile", missingTile);
		var xStart = 0;
		var xEnd = Math.pow(2, $scope.boardSize) - 1;
		var yStart = 0;
		var yEnd = Math.pow(2, $scope.boardSize) - 1;
		console.log("section", whichSection(missingTile, xStart, xEnd, yStart, yEnd));
		jHelper(missingTile, xStart, xEnd, yStart, yEnd);
		
		// draw moves
		trominoesCtrl.drawInterval = setInterval(drawNextMove, 2000 - trominoesCtrl.speed);

		console.log("finished drawing moves");
	};

	function drawNextMove() {
		console.log("drawNextMove", movesDrawn, trominoesCtrl.moves.length);
		if (trominoesCtrl.moves.length <= movesDrawn) {
			// all moves have been drawn
			clearInterval(trominoesCtrl.drawInterval);
			return;
		}
		drawMove(movesDrawn);
		movesDrawn++;
	}

	/* L-Recursive Algorithm */
	this.tileL = function() {
		console.log("You chose the L-Recursive algorithm.");

	};

});