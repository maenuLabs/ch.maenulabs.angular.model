/* globals angular */
/**
 * Controls the resource update.
 *
 * @module ch.maenulabs.rest.angular.controller
 * @class UpdateFactory
 */
angular.module('ch.maenulabs.rest.angular.controller').factory('ch.maenulabs.rest.angular.controller.UpdateFactory', function () {
	return [
		'$scope', 'resource', function ($scope, resource) {
			$scope.resource = resource;
			$scope.$watchGroup($scope.resource.getChangeables(), function () {
				$scope.$emit('ch.maenulabs.rest.angular.controller.Change', $scope.resource);
			});
			$scope.$watch('resource.hasErrors()', function (hasErrors) {
				if (hasErrors) {
					$scope.$emit('ch.maenulabs.rest.angular.controller.validation.Error', $scope.resource);
				} else {
					$scope.$emit('ch.maenulabs.rest.angular.controller.validation.Success', $scope.resource);
				}
			});
			$scope.update = function () {
				$scope.resource.update().then(function (response) {
					$scope.$emit('ch.maenulabs.rest.angular.controller.update.Success', $scope.resource, response);
				}).catch(function (response) {
					$scope.$emit('ch.maenulabs.rest.angular.controller.update.Error', $scope.resource, response);
				});
			};
		}
	];
});
