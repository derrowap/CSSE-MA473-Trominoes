'use strict';

// Declare app level module which depends on views, and components
angular.module('app', [
  'app.trominoes',
  'app.view2',
  'ngRoute'
]).
config(['$routeProvider', function($routeProvider) {
	$routeProvider.
		when("/trominoes", {
			templateUrl: 'views/trominoes.html',
			controller: 'trominoesCtrl'}).
		when("/view2", {
			templateUrl: 'views/view2.html',
			controller: 'view2Ctrl'}).
		otherwise({redirectTo: '/trominoes'});
}]);
