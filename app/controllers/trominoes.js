'use strict';

angular.module('app.trominoes', []).
controller('trominoesCtrl', function($scope) {
	var trominoesCtrl = this;
	$scope.Math = window.Math;
	$scope.boardSize = 4;
	this.moves = [];
	this.currentOrientation = 'topLeft';

	this.trominoes = {
		'topRight': {
			'0': {
				'xOffset': -1,
				'yOffset': 0,
				'style': {
					'border': '2px solid black',
					'border-bottom': '0'
				}
			},
			'1': {
				'xOffset': -1,
				'yOffset': 1,
				'style': {
					'border-left': '2px solid black',
					'border-bottom': '2px solid black'
				}
			},
			'2': {
				'xOffset': 0,
				'yOffset': 1,
				'style': {
					'border': '2px solid black',
					'border-left': '0'
				}
			}
		},
		'topLeft': {
			'0': {
				'xOffset': 1,
				'yOffset': 0,
				'style': {
					'border': '2px solid black',
					'border-right': '0',
					'background-color': 'red'
				}
			},
			'1': {
				'xOffset': 1,
				'yOffset': 1,
				'style': {
					'border-right': '2px solid black',
					'border-bottom': '2px solid black',
					'background-color': 'red'
				}
			},
			'2': {
				'xOffset': 0,
				'yOffset': 1,
				'style': {
					'border': '2px solid black',
					'border-bottom': '0',
					'background-color': 'red'
				}
			}
		},
		'bottomRight': {
			'0': {
				'xOffset': -1,
				'yOffset': 0,
				'style': {
					'border': '2px solid black',
					'border-top': '0'
				}
			},
			'1': {
				'xOffset': -1,
				'yOffset': -1,
				'style': {
					'border-left': '2px solid black',
					'border-top': '2px solid black'
				}
			},
			'2': {
				'xOffset': 0,
				'yOffset': -1,
				'style': {
					'border': '2px solid black',
					'border-left': '0'
				}
			}
		},
		'bottomLeft': {
			'0': {
				'xOffset': 1,
				'yOffset': 0,
				'style': {
					'border': '2px solid black',
					'border-top': '0'
				}
			},
			'1': {
				'xOffset': 1,
				'yOffset': -1,
				'style': {
					'border-right': '2px solid black',
					'border-top': '2px solid black'
				}
			},
			'2': {
				'xOffset': 0,
				'yOffset': -1,
				'style': {
					'border': '2px solid black',
					'border-right': '0'
				}
			}
		}
	}


	$scope.setupBoard = function () {
		trominoesCtrl.board = [];
		for (var i = 0; i < Math.pow(2, $scope.boardSize); i++) {
			trominoesCtrl.board[i] = [];
			for (var j = 0; j < Math.pow(2, $scope.boardSize); j++) {
				trominoesCtrl.board[i][j] = {
					'style': {
						'background-color': 'grey',
						'border': '2px solid black'
					},
					'used': false
				};
			}
		}
	}

	$scope.setupBoard();

	$scope.updateBoardSize = function(increase) {
		if (increase && $scope.boardSize < 5) {
			$scope.boardSize++;
			$scope.error = null;
			$scope.setupBoard();
		} else if (!increase && $scope.boardSize > 1) {
			$scope.boardSize--;
			$scope.error = null;
			$scope.setupBoard();
		} else {
			$scope.error = "Allowed range for size of board is 2 to 32.";
		}
	}

	$scope.changeOrientation = function(orientation) {
		trominoesCtrl.currentOrientation = orientation;
	}

	var drawMove = function(index) {
		var move = trominoesCtrl.moves[index];
		var trominoPiece = trominoesCtrl.trominoes[move.orientation];


		for (var i = 0; i < 3; i++) {
			var spot = trominoPiece[i];
			trominoesCtrl.board[move.x + spot.xOffset][move.y + spot.yOffset].style = spot.style;
			trominoesCtrl.board[move.x + spot.xOffset][move.y + spot.yOffset].used = true;
		}
	}

	$scope.pushMove = function(col, row) {

		// Check if this is a valid move
		var trominoPiece = trominoesCtrl.trominoes[trominoesCtrl.currentOrientation];
		for (var i = 0; i < 3; i++) {
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
	}

	$scope.clickedSpot = function(col, row) {
		console.log("clicked:", col, row);
		$scope.pushMove(col, row);
	}


});