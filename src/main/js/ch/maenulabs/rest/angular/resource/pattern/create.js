/* globals angular */
/**
 * Controls the resource create.
 *
 * @module ch.maenulabs.rest.angular.resource.pattern
 * @class create
 */
angular.module('ch.maenulabs.rest.angular.resource.pattern').factory('ch.maenulabs.rest.angular.resource.pattern.create', [
	'ch.maenulabs.rest.angular.resource.eventify.action',
	'ch.maenulabs.rest.angular.resource.eventify.validation',
	function (action, validation) {
		return function ($scope, resource) {
			validation($scope, resource);
			return action($scope, resource, 'create');
		};
	}
]);
