/* globals angular */
/**
 * Installs an eventifyer on a scheduled action.
 *
 * @module ch.maenulabs.rest.angular.event
 * @class eventifySchedule
 */
angular.module('ch.maenulabs.rest.angular.event').factory('ch.maenulabs.rest.angular.event.eventifySchedule', [
	'$timeout',
	function ($timeout) {
		/**
		 * Installs an eventifyer on a scheduled action in the specified scope.
		 * 
		 * @method eventifySchedule
		 * 
		 * @param {Scope} $scope The scope
		 * @param {Number} delay The delay in milliseconds
		 * 
		 * @return {Function} Cancels the promise
		 */
		return function ($scope, delay) {
			var promise = $timeout(angular.noop, delay);
			var cancel = function () {
				return $timeout.cancel(promise);
			};
			$scope.$emit('ch.maenulabs.rest.angular.event.schedule.Scheduled', cancel);
			promise.then(function (response) {
				$scope.$emit('ch.maenulabs.rest.angular.event.schedule.Done', cancel);
				return response;
			}).catch(function (response) {
				$scope.$emit('ch.maenulabs.rest.angular.event.schedule.Cancelled', cancel);
				return response;
			});
			return cancel;
		};
	}
]);
