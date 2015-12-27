/* global describe, it, beforeEach, expect, jasmine, module, inject */
describe('decorator', function () {

	var $scope;
	var $controller;
	var Controller;
	var resource;
	
	beforeEach(module('ch.maenulabs.rest.angular.controller.decorator', function($provide, $controllerProvider) {
		Controller = jasmine.createSpy();
		$controllerProvider.register('Controller', [
			'$scope',
			'resource',
			Controller
		]);
    }));

	beforeEach(inject(['$controller', '$rootScope', function (_$controller_, _$rootScope_) {
		$controller = _$controller_;
		resource = {};
		$scope = _$rootScope_.$new();
		$scope.resource = resource;
	}]));

	it('should throw error on wrong format', function () {
		expect(function () {
			$controller('Controller as a as b', {
				'$scope': $scope
			});
		}).toThrow();
		expect(Controller).not.toHaveBeenCalledWith();
	});

	it('should instantiate factory controller without resource and without identifier', function () {
		$controller('Controller', {
			'$scope': $scope,
			'resource': resource
		});
		expect(Controller).toHaveBeenCalledWith($scope, resource);
		expect($scope.test).not.toBeDefined();
	});

	it('should instantiate factory controller without resource and with identifier', function () {
		var controller = $controller('Controller as test', {
			'$scope': $scope,
			'resource': resource
		});
		expect(Controller).toHaveBeenCalledWith($scope, resource);
		expect($scope.test).toBe(controller);
	});

	it('should instantiate factory controller with resource and without identifier', function () {
		$controller('Controller(resource)', {
			'$scope': $scope
		});
		expect(Controller).toHaveBeenCalledWith($scope, resource);
		expect($scope.test).not.toBeDefined();
	});

	it('should instantiate factory controller with resource and with identifier', function () {
		var controller = $controller('Controller(resource) as test', {
			'$scope': $scope
		});
		expect(Controller).toHaveBeenCalledWith($scope, resource);
		expect($scope.test).toBe(controller);
	});

});
