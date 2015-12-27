/* globals angular */
/**
 * Controls the resource delete.
 *
 * @module ch.maenulabs.rest.angular.controller
 * @class Delete
 */
angular.module('ch.maenulabs.rest.angular.controller').controller('ch.maenulabs.rest.angular.controller.Delete', [
	'$scope',
	'ch.maenulabs.rest.angular.event.eventifyAction',
	'resource',
	function ($scope, eventifyAction, resource) {
		this.resource = resource;
		this.delete = eventifyAction($scope, this.resource, 'delete');
	}
]);
