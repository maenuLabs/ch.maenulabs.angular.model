/* globals angular */
/**
 * Controls the resource read.
 *
 * @module ch.maenulabs.rest.angular.controller
 * @class ReadFactory
 */
angular.module('ch.maenulabs.rest.angular.controller').factory('ch.maenulabs.rest.angular.controller.ReadFactory', [
	'ch.maenulabs.rest.angular.service.eventifyAction',
	function (eventifyAction) {
		return [
			'$scope',
			'resource',
			function ($scope, resource) {
				$scope.resource = resource;
				$scope.read = eventifyAction($scope, $scope.resource, 'read');
			}
		];
	}
]);
