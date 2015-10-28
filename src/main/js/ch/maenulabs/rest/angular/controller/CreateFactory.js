/* globals angular */
/**
 * Controls the resource create.
 *
 * @module ch.maenulabs.rest.angular.controller
 * @class CreateFactory
 */
angular.module('ch.maenulabs.rest.angular.controller').factory('ch.maenulabs.rest.angular.controller.CreateFactory', [
	'ch.maenulabs.rest.angular.service.eventifyAction',
	'ch.maenulabs.rest.angular.service.eventifyValidation',
	function (eventifyAction, eventifyValidation) {
		return [
			'$scope',
			'resource',
			function ($scope, resource) {
				eventifyValidation($scope, resource);
				this.create = eventifyAction($scope, resource, 'create');
			}
		];
	}
]);
