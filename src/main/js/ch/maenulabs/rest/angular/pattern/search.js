/* globals angular */
/**
 * Controls the resource search.
 *
 * @module ch.maenulabs.rest.angular.pattern
 * @class search
 */
angular.module('ch.maenulabs.rest.angular.pattern').factory('ch.maenulabs.rest.angular.pattern.search', [
	'$timeout',
	'ch.maenulabs.rest.angular.eventify.action',
	'ch.maenulabs.rest.angular.eventify.change',
	function ($timeout, action, change) {
		return function ($scope, resource, delay) {
			return function () {
				var scheduled = undefined;
				var unwatchChange = angular.noop;
				var unwatchChanged = angular.noop;
				var unwatch = function () {
					unwatchChange();
					unwatchChanged();
					unwatchChange = angular.noop;
					unwatchChanged = angular.noop;
				};
				var search = action($scope, resource, 'search');
				unwatchChange = change($scope, resource);
				unwatchChanged = $scope.$on('ch.maenulabs.rest.angular.eventify.change.Changed', function ($event, candidate) {
					if (candidate != $scope[resource]) {
						return;
					}
					if (scheduled) {
						$timeout.cancel(scheduled);
					}
					scheduled = $timeout(delay);
					scheduled.then(function () {
						scheduled = undefined;
						search();
					});
				});
				return unwatch;
			};
		};
	}
]);
