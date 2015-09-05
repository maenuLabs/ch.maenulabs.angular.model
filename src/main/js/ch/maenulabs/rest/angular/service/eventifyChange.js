/* globals angular */
/**
 * Installs a watcher on a resource's changes.
 *
 * @module ch.maenulabs.rest.angular.service
 * @class eventifyChange
 */
angular.module('ch.maenulabs.rest.angular.service').factory('ch.maenulabs.rest.angular.service.eventifyChange', function () {
	/**
	 * Installs an eventifyer on the specified resource's change in the specified scope.
	 * 
	 * @method eventifyChange
	 * 
	 * @param {Scope} $scope The scope
	 * @param {IResource} resource The resource property name
	 */
	return function ($scope, resource) {
		return $scope.$watchGroup(resource.getChangeables(), function () {
			$scope.$emit('ch.maenulabs.rest.angular.resource.Changed', resource);
		});
	};
});
