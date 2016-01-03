/* globals angular */
/**
 * Controls the resource create.
 *
 * @module ch.maenulabs.rest.angular.pattern
 * @class create
 */
angular.module('ch.maenulabs.rest.angular.pattern').factory('ch.maenulabs.rest.angular.pattern.create', [
	'ch.maenulabs.rest.angular.eventify.action',
	'ch.maenulabs.rest.angular.eventify.validation',
	function (action, validation) {
		return function ($scope, resource) {
			validation($scope, resource);
			return action($scope, resource, 'create');
		};
	}
]);
