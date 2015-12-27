/* globals angular */
/**
 * Controls the resource read.
 *
 * @module ch.maenulabs.rest.angular.controller
 * @class Read
 */
angular.module('ch.maenulabs.rest.angular.controller').controller('ch.maenulabs.rest.angular.controller.Read', [
	'$scope',
	'ch.maenulabs.rest.angular.event.eventifyAction',
	'resource',
	function ($scope, eventifyAction, resource) {
		this.resource = resource;
		this.read = eventifyAction($scope, this.resource, 'read');
	}
]);
