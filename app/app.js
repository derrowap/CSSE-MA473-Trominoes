'use strict';

// Declare app level module which depends on views, and components
angular.module('app', [
  'app.trominoes',
  'ngRoute'
]).
config(['$routeProvider', function($routeProvider) {
	$routeProvider.
		when("/trominoes", {
			templateUrl: 'views/trominoes.html',
			controller: 'trominoesCtrl'}).
		otherwise({redirectTo: '/trominoes'});
}]);
