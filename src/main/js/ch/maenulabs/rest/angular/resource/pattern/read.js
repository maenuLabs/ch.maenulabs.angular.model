/* globals angular */
/**
 * Controls the resource read.
 *
 * @module ch.maenulabs.rest.angular.resource.pattern
 * @class read
 */
angular.module('ch.maenulabs.rest.angular.resource.pattern').factory('ch.maenulabs.rest.angular.resource.pattern.read', [
	'ch.maenulabs.rest.angular.resource.eventify.action',
	function (action) {
		return function ($scope, resource) {
			return action($scope, resource, 'read');
		};
	}
]);
