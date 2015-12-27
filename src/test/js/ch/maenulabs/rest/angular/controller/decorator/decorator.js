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
		$provide.factory('ch.maenulabs.rest.angular.controller.Test', function () {
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
		$controller('Controller', {
			'$scope': $scope
		});
		expect(Controller).toHaveBeenCalledWith($scope);
	});

	it('should instantiate factory controller without resource and without identifier', function () {
		$controller('Test', {
			'$scope': $scope,
			'resource': resource
		});
		expect(Test).toHaveBeenCalledWith($scope, resource);
		expect($scope.test).not.toBeDefined();
	});

	it('should instantiate factory controller without resource and with identifier', function () {
		var controller = $controller('Test as test', {
			'$scope': $scope,
			'resource': resource
		});
		expect(Test).toHaveBeenCalledWith($scope, resource);
		expect($scope.test).toBe(controller);
	});

	it('should instantiate factory controller with resource and without identifier', function () {
		$controller('Test(resource)', {
			'$scope': $scope
		});
		expect(Test).toHaveBeenCalledWith($scope, resource);
		expect($scope.test).not.toBeDefined();
	});

	it('should instantiate factory controller with resource and with identifier', function () {
		var controller = $controller('Test(resource) as test', {
			'$scope': $scope
		});
		expect(Test).toHaveBeenCalledWith($scope, resource);
		expect($scope.test).toBe(controller);
	});

});
