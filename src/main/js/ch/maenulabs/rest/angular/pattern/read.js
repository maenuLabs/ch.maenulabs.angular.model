/* globals angular */
/**
 * Controls the resource read.
 *
 * @module ch.maenulabs.rest.angular.pattern
 * @class read
 */
angular.module('ch.maenulabs.rest.angular.pattern').factory('ch.maenulabs.rest.angular.pattern.read', [
	'ch.maenulabs.rest.angular.eventify.action',
	function (action) {
		return function ($scope, resource) {
			return action($scope, resource, 'read');
		};
	}
]);
