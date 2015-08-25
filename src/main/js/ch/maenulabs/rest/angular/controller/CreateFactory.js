/* globals angular */
/**
 * Controls the resource create.
 *
 * @module ch.maenulabs.rest.angular.controller
 * @class CreateFactory
 */
angular.module('ch.maenulabs.rest.angular.controller').factory('ch.maenulabs.rest.angular.controller.CreateFactory', function () {
	return [
		'$scope', 'resource', function ($scope, resource) {
			$scope.resource = resource;
			$scope.$watch('resource.hasErrors()', function (hasErrors) {
				if (!hasErrors) {
					$scope.$emit('ch.maenulabs.rest.angular.controller.validation.Success', $scope.resource);
				} else {
					$scope.$emit('ch.maenulabs.rest.angular.controller.validation.Error', $scope.resource);
				}
			});
			$scope.create = function () {
				$scope.resource.create().then(function (response) {
					$scope.$emit('ch.maenulabs.rest.angular.controller.create.Success', $scope.resource, response);
				}).catch(function (response) {
					$scope.$emit('ch.maenulabs.rest.angular.controller.create.Error', $scope.resource, response);
				});
			};
		}
	];
});
