/* globals angular */
/**
 * Controls the resource delete.
 *
 * @module ch.maenulabs.rest.angular.controller
 * @class DeleteFactory
 */
angular.module('ch.maenulabs.rest.angular.controller').factory('ch.maenulabs.rest.angular.controller.DeleteFactory', [
	'ch.maenulabs.rest.angular.service.eventifyAction',
	function (eventifyAction) {
		return [
			'$scope',
			'resource',
			function ($scope, resource) {
				$scope.resource = resource;
				$scope.delete = eventifyAction($scope, $scope.resource, 'delete');
			}
		];
	}
]);
