/* globals angular */
/**
 * Controls the resource read.
 *
 * @module ch.maenulabs.rest.angular.controller
 * @class ReadFactory
 */
angular.module('ch.maenulabs.rest.angular.controller').factory('ch.maenulabs.rest.angular.controller.ReadFactory', function () {
	return [
		'$scope', 'resource', function ($scope, resource) {
			$scope.resource = resource;
		}
	];
});
