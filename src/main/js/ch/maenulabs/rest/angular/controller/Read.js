/* globals angular */
/**
 * Controls the resource read.
 *
 * @module ch.maenulabs.rest.angular.controller
 * @class Read
 */
angular.module('ch.maenulabs.rest.angular.controller').factory('ch.maenulabs.rest.angular.controller.Read', [
	'ch.maenulabs.rest.angular.event.eventifyAction',
	function (eventifyAction) {
		return [
			'$scope',
			'resource',
			function ($scope, resource) {
				this.resource = resource;
				this.read = eventifyAction($scope, this.resource, 'read');
			}
		];
	}
]);
