/* globals angular */
/**
 * Controls the resource create.
 *
 * @module ch.maenulabs.rest.angular.controller
 * @class Create
 */
angular.module('ch.maenulabs.rest.angular.controller').controller('ch.maenulabs.rest.angular.controller.Create', [
	'$scope',
	'ch.maenulabs.rest.angular.event.eventifyAction',
	'ch.maenulabs.rest.angular.event.eventifyValidation',
	'resource',
	function ($scope, eventifyAction, eventifyValidation, resource) {
		this.resource = resource;
		eventifyValidation($scope, this.resource);
		this.create = eventifyAction($scope, this.resource, 'create');
	}
]);
