/* globals angular */
/**
 * Controls the resource delete.
 *
 * @module ch.maenulabs.rest.angular.controller
 * @class Delete
 */
angular.module('ch.maenulabs.rest.angular.controller').factory('ch.maenulabs.rest.angular.controller.Delete', [
	'ch.maenulabs.rest.angular.event.eventifyAction',
	function (eventifyAction) {
		return [
			'$scope',
			'resource',
			function ($scope, resource) {
				this.resource = resource;
				this.delete = eventifyAction($scope, this.resource, 'delete');
			}
		];
	}
]);
