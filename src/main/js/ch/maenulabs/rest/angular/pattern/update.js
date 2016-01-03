/* globals angular */
/**
 * Controls the resource update.
 *
 * @module ch.maenulabs.rest.angular.pattern
 * @class update
 */
angular.module('ch.maenulabs.rest.angular.pattern').factory('ch.maenulabs.rest.angular.pattern.update', [
	'ch.maenulabs.rest.angular.eventify.action',
	'ch.maenulabs.rest.angular.eventify.validation',
	'ch.maenulabs.rest.angular.eventify.change',
	function (action, validation, change) {
		return function ($scope, resource) {
			change($scope, resource);
			validation($scope, resource);
			return action($scope, resource, 'update');
		};
	}
]);
