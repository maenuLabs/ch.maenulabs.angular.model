/* global describe, it, beforeEach, expect, jasmine, module, inject */
describe('decorator', function () {

	var $scope;
	var $controller;
	var Controller;
	var Test;
	var resource;
	
	beforeEach(module('ch.maenulabs.rest.angular.controller.decorator', function($provide, $controllerProvider) {
		Controller = jasmine.createSpy();
		$controllerProvider.register('Controller', ['$scope', Controller]);
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
		$scope.resource = resource;
	}]));

	it('should instantiate controller', function () {
		controller = $controller('Controller', {
			'$scope': $scope
		});
		expect(Controller).toHaveBeenCalledWith($scope);
	});

	it('should instantiate factory controller without name', function () {
		controller = $controller('Test(resource)', {
			'$scope': $scope
		});
		expect(Test).toHaveBeenCalledWith($scope, resource);
		expect($scope.test).not.toBeDefined();
	});

	it('should instantiate factory controller with name', function () {
		controller = $controller('Test(resource) as test', {
			'$scope': $scope
		});
		expect(Test).toHaveBeenCalledWith($scope, resource);
		expect($scope.test).toBe(controller);
	});

});
