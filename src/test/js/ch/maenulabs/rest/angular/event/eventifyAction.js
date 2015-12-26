/* global describe, it, beforeEach, expect, jasmine, module, inject */
describe('eventifyAction', function () {

	var $scope;
	var action;
	var promise;
	var eventifiedAction;
	
	beforeEach(module('ch.maenulabs.rest.angular.event'));

	beforeEach(inject(['$controller', '$rootScope', 'ch.maenulabs.rest.angular.event.eventifyAction', function (_$controller_, _$rootScope_, _eventifyAction_) {
		$scope = _$rootScope_.$new();
		action = 'act';
		promise = {};
		promise.then = jasmine.createSpy().and.returnValue(promise);
		promise.catch = jasmine.createSpy().and.returnValue(promise);
		$scope.resource = {};
		$scope.resource[action] = jasmine.createSpy().and.returnValue(promise);
		eventifiedAction = _eventifyAction_($scope, $scope.resource, action);
	}]));
	
	describe('arguments', function () {
		
		var argument1;
		var argument2;
		var argument3;
		
		beforeEach(function () {
			argument1 = {};
			argument2 = 1;
			argument3 = '';
			eventifiedAction(argument1, argument2, argument3);
		});
		
		it('should call action with arguments', function () {
			expect($scope.resource[action]).toHaveBeenCalledWith(argument1, argument2, argument3);
		});
		
	});
	
	describe('events', function () {
		
		var pending;
		var success;
		var error;
		
		beforeEach(function () {
			pending = jasmine.createSpy();
			success = jasmine.createSpy();
			error = jasmine.createSpy();
			$scope.$on('ch.maenulabs.rest.angular.resource.' + action + '.Pending', pending);
			$scope.$on('ch.maenulabs.rest.angular.resource.' + action + '.Success', success);
			$scope.$on('ch.maenulabs.rest.angular.resource.' + action + '.Error', error);
			eventifiedAction();
		});
		
		it('should call action', function () {
			expect($scope.resource[action]).toHaveBeenCalled();
		});

		it('should emit event on pending', function () {
			expect(pending).toHaveBeenCalled();
			expect(success).not.toHaveBeenCalled();
			expect(error).not.toHaveBeenCalled();
			expect(pending.calls.mostRecent().args[1]).toBe($scope.resource);
		});
		
		it('should emit event on success', function () {
			pending.calls.reset();
			var response = {};
			promise.then.calls.mostRecent().args[0](response);
			expect(pending).not.toHaveBeenCalled();
			expect(success).toHaveBeenCalled();
			expect(error).not.toHaveBeenCalled();
			expect(success.calls.mostRecent().args[1]).toBe($scope.resource);
			expect(success.calls.mostRecent().args[2]).toBe(response);
		});
		
		it('should emit event on error', function () {
			pending.calls.reset();
			var response = {};
			promise.catch.calls.mostRecent().args[0](response);
			expect(pending).not.toHaveBeenCalled();
			expect(success).not.toHaveBeenCalled();
			expect(error).toHaveBeenCalled();
			expect(error.calls.mostRecent().args[1]).toBe($scope.resource);
			expect(error.calls.mostRecent().args[2]).toBe(response);
		});
		
	});

});