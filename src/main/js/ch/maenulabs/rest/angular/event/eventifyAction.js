/* globals angular */
/**
 * Wraps a resource action to emit events.
 *
 * @module ch.maenulabs.rest.angular.event
 * @class eventifyAction
 */
angular.module('ch.maenulabs.rest.angular.event').factory('ch.maenulabs.rest.angular.event.eventifyAction', function () {
	/**
	 * Installs an eventifyer on the action on the specified resource in the specified scope to emit events on pending, success and error.
	 * 
	 * @method eventifyAction
	 * 
	 * @param {Scope} $scope The scope
	 * @param {IResource} resource The resource
	 * @param {String} action The action name to perform
	 * 
	 * @return {Function} Returns a promise, resolved on success or rejected on error.
	 *     Arguments are passed on to the wrapped function.
	 */
	return function ($scope, resource, action) {
		return function () {
			$scope.$emit('ch.maenulabs.rest.angular.resource.' + action + '.Pending', resource);
			return resource[action].apply(resource, arguments).then(function (response) {
				$scope.$emit('ch.maenulabs.rest.angular.resource.' + action + '.Success', resource, response);
				return response;
			}).catch(function (response) {
				$scope.$emit('ch.maenulabs.rest.angular.resource.' + action + '.Error', resource, response);
				return response;
			});
		};
	};
});
