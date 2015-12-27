/* globals angular */
/**
 * Controls the resource update.
 *
 * @module ch.maenulabs.rest.angular.controller
 * @class Update
 */
angular.module('ch.maenulabs.rest.angular.controller').controller('ch.maenulabs.rest.angular.controller.Update', [
	'$scope',
	'ch.maenulabs.rest.angular.event.eventifyAction',
	'ch.maenulabs.rest.angular.event.eventifyValidation',
	'ch.maenulabs.rest.angular.event.eventifyChange',
	'resource',
	function ($scope, eventifyAction, eventifyValidation, eventifyChange, resource) {
		this.resource = resource;
		eventifyChange($scope, this.resource);
		eventifyValidation($scope, this.resource);
		this.update = eventifyAction($scope, this.resource, 'update');
	}
]);
