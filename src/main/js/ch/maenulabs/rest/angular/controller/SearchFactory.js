/* globals angular */
/**
 * Controls the resource search.
 *
 * @module ch.maenulabs.rest.angular.controller
 * @class SearchFactory
 */
angular.module('ch.maenulabs.rest.angular.controller').factory('ch.maenulabs.rest.angular.controller.SearchFactory', [
	'ch.maenulabs.rest.angular.event.eventifyAction',
	'ch.maenulabs.rest.angular.event.eventifyChange',
	'ch.maenulabs.rest.angular.event.eventifySchedule',
	function (eventifyAction, eventifyChange, eventifySchedule) {
		return [
			'$scope',
			'resource',
			'delay',
			function ($scope, resource, delay) {
				var cancel = angular.noop;
				this.resource = resource;
				this.search = eventifyAction($scope, this.resource, 'search');
				$scope.$on('ch.maenulabs.rest.angular.resource.Changed', function () {
					cancel();
					cancel = eventifySchedule($scope, delay);
				});
				$scope.$on('ch.maenulabs.rest.angular.event.schedule.Done', (function () {
					cancel = angular.noop;
					this.search();
				}).bind(this));
				eventifyChange($scope, this.resource);
			}
		];
	}
]);
