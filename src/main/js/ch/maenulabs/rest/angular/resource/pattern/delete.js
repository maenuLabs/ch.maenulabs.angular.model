/* globals angular */
/**
 * Controls the resource delete.
 *
 * @module ch.maenulabs.rest.angular.resource.pattern
 * @class delete
 */
angular.module('ch.maenulabs.rest.angular.resource.pattern').factory('ch.maenulabs.rest.angular.resource.pattern.delete', [
	'ch.maenulabs.rest.angular.resource.eventify.action',
	function (action) {
		return function ($scope, resource) {
			return action($scope, resource, 'delete');
		};
	}
]);
