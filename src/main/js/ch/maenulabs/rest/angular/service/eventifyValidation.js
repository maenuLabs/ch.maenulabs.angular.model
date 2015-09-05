/* globals angular */
/**
 * Installs a watcher on a resource's validation.
 *
 * @module ch.maenulabs.rest.angular.service
 * @class eventifyValidation
 */
angular.module('ch.maenulabs.rest.angular.service').factory('ch.maenulabs.rest.angular.service.eventifyValidation', function () {
	/**
	 * Installs an eventifyer on the specified resource's validation in the specified scope.
	 * 
	 * @method eventifyValidation
	 * 
	 * @param {Scope} $scope The scope
	 * @param {IResource} resource The resource property name
	 */
	return function ($scope, resource) {
		return $scope.$watch(function () {
			return resource.hasErrors();
		}, function (hasErrors) {
			if (hasErrors) {
				$scope.$emit('ch.maenulabs.rest.angular.resource.validation.Error', resource);
			} else {
				$scope.$emit('ch.maenulabs.rest.angular.resource.validation.Success', resource);
			}
		});
	};
});
