/* globals angular */
/**
 * Installs a watcher on a resource's validation.
 *
 * @module ch.maenulabs.rest.angular.eventify
 * @class validation
 */
angular.module('ch.maenulabs.rest.angular.eventify').factory('ch.maenulabs.rest.angular.eventify.validation', function () {
	/**
	 * Installs an eventifyer on the specified resource's validation in the specified scope.
	 * 
	 * @method validation
	 * 
	 * @param {Scope} $scope The scope
	 * @param {String} resource The resource property name
	 */
	return function ($scope, resource) {
		return $scope.$watch(resource + '.hasErrors()', function (hasErrors) {
			if (hasErrors) {
				$scope.$emit('ch.maenulabs.rest.angular.eventify.validation.Error', $scope[resource]);
			} else {
				$scope.$emit('ch.maenulabs.rest.angular.eventify.validation.Success', $scope[resource]);
			}
		});
	};
});
