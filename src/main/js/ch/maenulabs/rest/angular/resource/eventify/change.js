/* globals angular */
/**
 * Installs a watcher on a resource's changes.
 *
 * @module ch.maenulabs.rest.angular.resource.eventify
 * @class change
 */
angular.module('ch.maenulabs.rest.angular.resource.eventify').factory('ch.maenulabs.rest.angular.resource.eventify.change', function () {
	/**
	 * Installs an eventifyer on the specified resource's change in the specified scope.
	 * 
	 * @method change
	 * 
	 * @param {Scope} $scope The scope
	 * @param {String} resource The resource property name
	 */
	return function ($scope, resource) {
		var unwatchResource = angular.noop;
		var unwatchChangeables = angular.noop;
		var unwatch = function () {
			unwatchResource();
			unwatchChangeables();
			unwatchResource = angular.noop;
			unwatchChangeables = angular.noop;
		};
		unwatchResource = $scope.$watch(resource, function (newValue, oldValue) {
			if (newValue != oldValue) {
				unwatchChangeables();
			}
			if (newValue) {
				var changeables = newValue.getChangeables().map(function (changeable) {
					return resource + '.' + changeable;
				});
				unwatchChangeables = $scope.$watchGroup(changeables, function () {
					$scope.$emit('ch.maenulabs.rest.angular.resource.eventify.Changed', $scope[resource]);
				});
			} else {
				unwatchChangeables = angular.noop;
			}
		});
		return unwatch;
	};
});
