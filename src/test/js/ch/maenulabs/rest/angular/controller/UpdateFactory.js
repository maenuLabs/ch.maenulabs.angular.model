/* global describe, it, beforeEach, expect, jasmine, module, inject */
describe('UpdateFactory', function () {

	var $scope;
	var changeables;
	var resource;
	var Update;
	
	beforeEach(module('ng', 'ch.maenulabs.rest.angular.controller'));

	beforeEach(inject(['$controller', '$rootScope', 'ch.maenulabs.rest.angular.controller.UpdateFactory', function (_$controller_, _$rootScope_, _UpdateFactory_) {
		changeables = [];
		resource = {
			getChangeables: jasmine.createSpy().and.returnValue(changeables)
		};
		$scope = _$rootScope_.$new();
		Update = _$controller_(_UpdateFactory_, {
			'$scope': $scope,
			'resource': resource
		});
	}]));

	it('should set the resource on the scope', function () {
		expect($scope.resource).toBe(resource);
	});
	
	describe('change', function () {
		
		it('should emit event on change', function () {
			var listener = jasmine.createSpy();
			$scope.$on('ch.maenulabs.rest.angular.controller.Change', listener);
			$scope.$apply();
			expect(listener.calls.mostRecent().args[1]).toBe(resource);
		});
		
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
	
	describe('update', function () {
		
		var promise;
		
		beforeEach(function () {
			promise = {};
			promise.then = jasmine.createSpy().and.returnValue(promise);
			promise.catch = jasmine.createSpy().and.returnValue(promise);
			resource.update = jasmine.createSpy().and.returnValue(promise);
			$scope.update();
		});
		
		it('should call create and register listeners', function () {
			expect(resource.update).toHaveBeenCalled();
			expect(promise.then).toHaveBeenCalled();
			expect(promise.catch).toHaveBeenCalled();
			expect(promise.then.calls.mostRecent().args[0] instanceof Function).toBeTruthy();
			expect(promise.catch.calls.mostRecent().args[0] instanceof Function).toBeTruthy();
			
		});
		
		it('should emit event on success', function () {
			var response = {};
			var listener = jasmine.createSpy();
			$scope.$on('ch.maenulabs.rest.angular.controller.update.Success', listener);
			promise.then.calls.mostRecent().args[0](response);
			expect(listener.calls.mostRecent().args[1]).toBe(resource);
			expect(listener.calls.mostRecent().args[2]).toBe(response);
		});
		
		it('should emit event on error', function () {
			var response = {};
			var listener = jasmine.createSpy();
			$scope.$on('ch.maenulabs.rest.angular.controller.update.Error', listener);
			promise.catch.calls.mostRecent().args[0](response);
			expect(listener.calls.mostRecent().args[1]).toBe(resource);
			expect(listener.calls.mostRecent().args[2]).toBe(response);
		});
		
	});

});
