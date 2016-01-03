/* global describe, it, beforeEach, expect, jasmine, module, inject */
describe('validation', function () {

	var $scope;
	var unwatch;
	
	beforeEach(module('ch.maenulabs.rest.angular.eventify'));

	beforeEach(inject(['$rootScope', 'ch.maenulabs.rest.angular.eventify.validation', function (_$rootScope_, _validation_) {
		$scope = _$rootScope_.$new();
		$scope.resource = {
			hasErrors: function () {
				return false;
			}
		};
		unwatch = _validation_($scope, 'resource');
	}]));
	
	describe('events', function () {
		
		var success;
		var error;
		
		beforeEach(function () {
			success = jasmine.createSpy();
			error = jasmine.createSpy();
			$scope.$on('ch.maenulabs.rest.angular.eventify.validation.Success', success);
			$scope.$on('ch.maenulabs.rest.angular.eventify.validation.Error', error);
		});
		
		describe('emission', function () {
			
			beforeEach(function () {
				$scope.$digest();
			});
			
			it('should emit event on init', function () {
				expect(success).toHaveBeenCalled();
				expect(success.calls.count()).toEqual(1);
				expect(success.calls.mostRecent().args[1]).toBe($scope.resource);
				expect(error).not.toHaveBeenCalled();
			});
			
			it('should emit event if resource has no errors', function () {
				$scope.resource.hasErrors = function () {
					return true;
				};
				$scope.$digest();
				success.calls.reset();
				error.calls.reset();
				$scope.resource.hasErrors = function () {
					return false;
				};
				$scope.$digest();
				expect(success).toHaveBeenCalled();
				expect(success.calls.mostRecent().args[1]).toBe($scope.resource);
				expect(error).not.toHaveBeenCalled();
			});
		
			it('should emit event if resource has errors', function () {
				$scope.resource.hasErrors = function () {
					return false;
				};
				$scope.$digest();
				success.calls.reset();
				error.calls.reset();
				$scope.resource.hasErrors = function () {
					return true;
				};
				$scope.$digest();
				expect(success).not.toHaveBeenCalled();
				expect(error).toHaveBeenCalled();
				expect(error.calls.mostRecent().args[1]).toBe($scope.resource);
			});
			
		});
		
		describe('unwatching', function () {
			
			beforeEach(function () {
				$scope.$digest();
				success.calls.reset();
				error.calls.reset();
				unwatch();
			});
			
			it('should not emit event if resource has no errors', function () {
				$scope.resource.hasErrors = function () {
					return false;
				};
				$scope.$digest();
				expect(success).not.toHaveBeenCalled();
				expect(error).not.toHaveBeenCalled();
			});
		
			it('should not emit event if resource has errors', function () {
				$scope.resource.hasErrors = function () {
					return true;
				};
				$scope.$digest();
				expect(success).not.toHaveBeenCalled();
				expect(error).not.toHaveBeenCalled();
			});
			
		});
		
		describe('watching', function () {
			
			var oldResource;
			var newResource;
			
			beforeEach(function () {
				oldResource = $scope.resource;
				newResource = {
					hasErrors: function () {
						return false;
					}
				};
				$scope.resource = newResource;
				$scope.$digest();
			});
			
			it('should unwatch errors on old resource', function () {
				expect(success).toHaveBeenCalled();
				expect(success.calls.count()).toEqual(1);
				expect(success.calls.mostRecent().args[1]).not.toBe(oldResource);
				expect(error).not.toHaveBeenCalled();
				success.calls.reset();
				error.calls.reset();
				oldResource.hasErrors = function () {
					return true;
				};
				$scope.$digest();
				expect(success).not.toHaveBeenCalled();
				expect(error).not.toHaveBeenCalled();
			});
			
			it('should watch errors on new resource', function () {
				expect(success).toHaveBeenCalled();
				expect(success.calls.count()).toEqual(1);
				expect(success.calls.mostRecent().args[1]).toBe(newResource);
				expect(error).not.toHaveBeenCalled();
				success.calls.reset();
				error.calls.reset();
				newResource.hasErrors = function () {
					return true;
				};
				$scope.$digest();
				expect(success).not.toHaveBeenCalled();
				expect(error).toHaveBeenCalled();
				expect(error.calls.count()).toEqual(1);
				expect(error.calls.mostRecent().args[1]).toBe(newResource);
			});
		
		});
		
	});

});
