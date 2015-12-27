/* globals angular */
/**
 * Controls the resource search.
 *
 * @module ch.maenulabs.rest.angular.controller
 * @class Search
 */
angular.module('ch.maenulabs.rest.angular.controller').controller('ch.maenulabs.rest.angular.controller.Search', [
	'$scope',
	'ch.maenulabs.rest.angular.event.eventifyAction',
	'ch.maenulabs.rest.angular.event.eventifyChange',
	'ch.maenulabs.rest.angular.event.eventifySchedule',
	'resource',
	'delay',
	function ($scope, eventifyAction, eventifyChange, eventifySchedule, resource, delay) {
		this.cancel = function () {};
		this.resource = resource;
		this.search = eventifyAction($scope, this.resource, 'search');
		$scope.$on('ch.maenulabs.rest.angular.resource.Changed', (function ($event, resource) {
			if (resource != this.resource) {
				return;
			}
			this.cancel();
			this.cancel = eventifySchedule($scope, delay);
		}).bind(this));
		$scope.$on('ch.maenulabs.rest.angular.event.schedule.Done', (function ($event, cancel) {
			if (cancel != this.cancel) {
				return;
			}
			this.cancel = function () {};
			this.search();
		}).bind(this));
		eventifyChange($scope, this.resource);
	}
]);
