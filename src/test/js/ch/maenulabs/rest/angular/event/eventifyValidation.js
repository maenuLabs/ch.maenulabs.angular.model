/* global describe, it, beforeEach, expect, jasmine, module, inject */
describe('eventifyValidation', function () {

	var $scope;
	var errors;
	var eventifyedValidation;
	
	beforeEach(module('ch.maenulabs.rest.angular.event'));

	beforeEach(inject(['$rootScope', 'ch.maenulabs.rest.angular.event.eventifyValidation', function (_$rootScope_, _eventifyValidation_) {
		$scope = _$rootScope_.$new();
		errors = false;
		$scope.resource = {
			hasErrors: function () {
				return errors;
			}
		};
		eventifyedValidation = _eventifyValidation_($scope, $scope.resource);
	}]));
	
	describe('events', function () {
		
		var success;
		var error;
		
		beforeEach(function () {
			success = jasmine.createSpy();
			error = jasmine.createSpy();
			$scope.$on('ch.maenulabs.rest.angular.resource.validation.Success', success);
			$scope.$on('ch.maenulabs.rest.angular.resource.validation.Error', error);
		});
		
		it('should emit event on success', function () {
			errors = false;
			$scope.$digest();
			expect(success).toHaveBeenCalled();
			expect(error).not.toHaveBeenCalled();
			expect(success.calls.mostRecent().args[1]).toBe($scope.resource);
		});
		
		it('should emit event on error', function () {
			errors = true;
			$scope.$digest();
			expect(success).not.toHaveBeenCalled();
			expect(error).toHaveBeenCalled();
			expect(error.calls.mostRecent().args[1]).toBe($scope.resource);
		});
		
		it('should deregister', function () {
			eventifyedValidation();
			errors = false;
			$scope.$digest();
			expect(success).not.toHaveBeenCalled();
			expect(error).not.toHaveBeenCalled();
			errors = true;
			$scope.$digest();
			expect(success).not.toHaveBeenCalled();
			expect(error).not.toHaveBeenCalled();
		});
		
	});

});
