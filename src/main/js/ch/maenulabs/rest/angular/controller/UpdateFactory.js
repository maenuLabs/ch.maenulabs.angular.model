/* globals angular */
/**
 * Controls the resource update.
 *
 * @module ch.maenulabs.rest.angular.controller
 * @class UpdateFactory
 */
angular.module('ch.maenulabs.rest.angular.controller').factory('ch.maenulabs.rest.angular.controller.UpdateFactory', [
	'ch.maenulabs.rest.angular.service.eventifyAction',
	'ch.maenulabs.rest.angular.service.eventifyValidation',
	'ch.maenulabs.rest.angular.service.eventifyChange',
	function (eventifyAction, eventifyValidation, eventifyChange) {
		return [
			'$scope',
			'resource',
			function ($scope, resource) {
				eventifyChange($scope, resource);
				eventifyValidation($scope, resource);
				$scope.update = eventifyAction($scope, resource, 'update');
			}
		];
}]);
