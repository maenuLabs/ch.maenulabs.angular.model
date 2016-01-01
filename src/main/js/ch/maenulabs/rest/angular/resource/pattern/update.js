/* globals angular */
/**
 * Controls the resource update.
 *
 * @module ch.maenulabs.rest.angular.resource.pattern
 * @class update
 */
angular.module('ch.maenulabs.rest.angular.resource.pattern').factory('ch.maenulabs.rest.angular.resource.pattern.update', [
	'ch.maenulabs.rest.angular.resource.eventify.action',
	'ch.maenulabs.rest.angular.resource.eventify.validation',
	'ch.maenulabs.rest.angular.resource.eventify.change',
	function (action, validation, change) {
		return function ($scope, resource) {
			change($scope, resource);
			validation($scope, resource);
			return action($scope, resource, 'update');
		};
	}
]);
