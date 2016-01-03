/* globals angular */
/**
 * Installs a watcher on a resource's changes.
 *
 * @module ch.maenulabs.rest.angular.eventify
 * @class change
 */
angular.module('ch.maenulabs.rest.angular.eventify').factory('ch.maenulabs.rest.angular.eventify.change', function () {
	/**
	 * Installs an eventifyer on the specified resource's change in the specified scope.
	 * 
	 * @method change
	 * 
	 * @param {Scope} $scope The scope
	 * @param {String} resource The resource property name
	 * @param {Array<String>} changeables The changeable properties
	 */
	return function ($scope, resource, changeables) {
		changeables = changeables.map(function (changeable) {
			return resource + '.' + changeable;
		});
		return $scope.$watchGroup(changeables, function () {
			$scope.$emit('ch.maenulabs.rest.angular.eventify.change.Changed', $scope[resource]);
		});
	};
});
