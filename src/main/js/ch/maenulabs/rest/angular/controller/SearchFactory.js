/* globals angular, ch */
/**
 * Controls the resource search.
 *
 * @module ch.maenulabs.rest.angular.controller
 * @class SearchFactory
 */
angular.module('ch.maenulabs.rest.angular.controller').factory('ch.maenulabs.rest.angular.controller.SearchFactory', [
	'$timeout', '$q', function ($timeout, $q) {
		var SearchEvent = ch.maenulabs.type.Type(Object, {
			delay: null,
			state: null,
			promise: null,
			initialize: function (delay) {
				this.delay = delay;
				this.state = this.type.INITIALIZED;
				this.promise = $q.defer().promise;
			},
			schedule: function (search) {
				this.state = this.type.SCHEDULED;
				var deferred = $q.defer();
				this.promise = $timeout(angular.bind(this, function () {
					return search().then(angular.bind(this, function (response) {
						this.state = this.type.SUCCESS;
						deferred.resolve(response);
						return response;
					})).catch(angular.bind(this, function (response) {
						this.state = this.type.ERROR;
						deferred.reject(response);
						return response;
					}));
				}), this.delay);
				this.promise.catch(angular.bind(this, function (response) {
					this.state = this.type.CANCELLED;
					deferred.reject(response);
					return response;
				}));
				return deferred.promise;
			},
			cancel: function () {
				$timeout.cancel(this.promise);
			}
		}, {
			INITIALIZED: 1,
			SCHEDULED: 2,
			CANCELLED: 3,
			SUCCESS: 4,
			ERROR: 5
		});
		var DELAY = 1000;
		return [
			'$scope', 'resource', function ($scope, resource) {
				$scope.resource = resource;
				$scope.currentSearchEvent = new SearchEvent(DELAY);
				$scope.search = function () {
					$scope.currentSearchEvent.cancel();
					$scope.currentSearchEvent = new SearchEvent(DELAY);
					$scope.currentSearchEvent.schedule($scope.resource.search).then(function (response) {
						$scope.$emit('ch.maenulabs.rest.angular.controller.search.Success', $scope.currentSearchEvent, $scope.resource, response);
						return response;
					}).catch(function (response) {
						$scope.$emit('ch.maenulabs.rest.angular.controller.search.Error', $scope.currentSearchEvent, $scope.resource, response);
						return response;
					});
					$scope.$emit('ch.maenulabs.rest.angular.controller.search.Pending', $scope.currentSearchEvent, $scope.resource);
				};
				$scope.$watchGroup($scope.resource.getChangeables(), $scope.search);
			}
		];
	}
]);
