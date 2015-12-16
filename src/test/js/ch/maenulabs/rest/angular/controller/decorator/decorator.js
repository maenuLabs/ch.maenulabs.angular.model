/* global describe, it, beforeEach, expect, jasmine, module, inject */
describe('decorator', function () {

	var $scope;
	var $controller;
	var Test;
	var resource;
	
	beforeEach(module('ch.maenulabs.rest.angular.controller.decorator', function($provide) {
		Test = jasmine.createSpy();
		$provide.factory('ch.maenulabs.rest.angular.controller.TestFactory', function () {
			return [
				'$scope',
				'resource',
				Test
			];
		});
    }));

	beforeEach(inject(['$controller', '$rootScope', function (_$controller_, _$rootScope_) {
		$controller = _$controller_;
		resource = {};
		$scope = _$rootScope_.$new();
		$scope.$resolve = {
			resource: resource
		}
	}]));

	it('should instantiate controller without id', function () {
		controller = $controller('Test', {
			'$scope': $scope
		});
		expect(Test).toHaveBeenCalledWith($scope, resource);
		expect($scope.test).not.toBeDefined();
	});

	it('should instantiate controller with id', function () {
		controller = $controller('Test as test', {
			'$scope': $scope
		});
		expect(Test).toHaveBeenCalledWith($scope, resource);
		expect($scope.test).toBe(controller);
	});

});
