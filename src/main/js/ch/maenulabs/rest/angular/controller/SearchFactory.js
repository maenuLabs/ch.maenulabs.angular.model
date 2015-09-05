/* globals angular */
/**
 * Controls the resource search.
 *
 * @module ch.maenulabs.rest.angular.controller
 * @class SearchFactory
 */
angular.module('ch.maenulabs.rest.angular.controller').factory('ch.maenulabs.rest.angular.controller.SearchFactory', [
	'ch.maenulabs.rest.angular.service.eventifyAction',
	'ch.maenulabs.rest.angular.service.eventifyChange',
	'ch.maenulabs.rest.angular.service.eventifySchedule',
	function (eventifyAction, eventifyChange, eventifySchedule) {
		var DELAY = 300;
		return [
			'$scope',
			'resource',
			function ($scope, resource) {
				$scope.resource = resource;
				$scope.search = eventifyAction($scope, $scope.resource, 'search');
				$scope.$on('ch.maenulabs.rest.angular.resource.Changed', function () {
					eventifySchedule($scope, DELAY);
				});
				$scope.$on('ch.maenulabs.rest.angular.service.schedule.Done', function () {
					$scope.search();
				});
				eventifyChange($scope, $scope.resource);
			}
		];
	}
]);
