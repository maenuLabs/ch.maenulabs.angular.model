/* global describe, it, beforeEach, expect, jasmine, module, inject */
describe('CreateFactory', function () {

	var $scope;
	var resource;
	var Create;
	
	beforeEach(module('ng', 'ch.maenulabs.rest.angular.controller'));

	beforeEach(inject(['$controller', '$rootScope', 'ch.maenulabs.rest.angular.controller.CreateFactory', function (_$controller_, _$rootScope_, _CreateFactory_) {
		resource = {};
		$scope = _$rootScope_.$new();
		Create = _$controller_(_CreateFactory_, {
			'$scope': $scope,
			'resource': resource
		});
	}]));

	it('should set the resource on the scope', function () {
		expect($scope.resource).toBe(resource);
	});
	
	describe('validation', function () {
		
		it('should emit event on success', function () {
			resource.hasErrors = function () {
				return false;
			};
			var listener = jasmine.createSpy();
			$scope.$on('ch.maenulabs.rest.angular.controller.validation.Success', listener);
			$scope.$apply();
			expect(listener.calls.mostRecent().args[1]).toBe(resource);
		});
		
		it('should emit event on error', function () {
			resource.hasErrors = function () {
				return true;
			};
			var listener = jasmine.createSpy();
			$scope.$on('ch.maenulabs.rest.angular.controller.validation.Error', listener);
			$scope.$apply();
			expect(listener.calls.mostRecent().args[1]).toBe(resource);
		});
		
	});
	
	describe('create', function () {
		
		var promise;
		
		beforeEach(function () {
			promise = {};
			promise.then = jasmine.createSpy().and.returnValue(promise);
			promise.catch = jasmine.createSpy().and.returnValue(promise);
			resource.create = jasmine.createSpy().and.returnValue(promise);
			$scope.create();
		});
		
		it('should call create and register listeners', function () {
			expect(resource.create).toHaveBeenCalled();
			expect(promise.then).toHaveBeenCalled();
			expect(promise.catch).toHaveBeenCalled();
			expect(promise.then.calls.mostRecent().args[0] instanceof Function).toBeTruthy();
			expect(promise.catch.calls.mostRecent().args[0] instanceof Function).toBeTruthy();
			
		});
		
		it('should emit event on success', function () {
			var response = {};
			var listener = jasmine.createSpy();
			$scope.$on('ch.maenulabs.rest.angular.controller.create.Success', listener);
			promise.then.calls.mostRecent().args[0](response);
			expect(listener.calls.mostRecent().args[1]).toBe(resource);
			expect(listener.calls.mostRecent().args[2]).toBe(response);
		});
		
		it('should emit event on error', function () {
			var response = {};
			var listener = jasmine.createSpy();
			$scope.$on('ch.maenulabs.rest.angular.controller.create.Error', listener);
			promise.catch.calls.mostRecent().args[0](response);
			expect(listener.calls.mostRecent().args[1]).toBe(resource);
			expect(listener.calls.mostRecent().args[2]).toBe(response);
		});
		
	});

});
