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
		return [
			'$scope',
			'resource',
			'delay',
			function ($scope, resource, delay) {
				var cancel = angular.noop;
				$scope.resource = resource;
				$scope.search = eventifyAction($scope, $scope.resource, 'search');
				$scope.$on('ch.maenulabs.rest.angular.resource.Changed', function () {
					cancel();
					cancel = eventifySchedule($scope, delay);
				});
				$scope.$on('ch.maenulabs.rest.angular.service.schedule.Done', function () {
					cancel = angular.noop;
					$scope.search();
				});
				eventifyChange($scope, $scope.resource);
			}
		];
	}
]);
