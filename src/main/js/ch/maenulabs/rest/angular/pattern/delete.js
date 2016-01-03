/* globals angular */
/**
 * Controls the resource delete.
 *
 * @module ch.maenulabs.rest.angular.pattern
 * @class delete
 */
angular.module('ch.maenulabs.rest.angular.pattern').factory('ch.maenulabs.rest.angular.pattern.delete', [
	'ch.maenulabs.rest.angular.eventify.action',
	function (action) {
		return function ($scope, resource) {
			return action($scope, resource, 'delete');
		};
	}
]);
