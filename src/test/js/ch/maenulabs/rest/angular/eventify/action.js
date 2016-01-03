/* global describe, it, beforeEach, expect, jasmine, module, inject */
describe('action', function () {

	var $q;
	var $scope;
	var response;
	var action;
	var deferred;
	var eventifiedAction;
	
	beforeEach(module('ch.maenulabs.rest.angular.eventify'));

	beforeEach(inject(['$q', '$rootScope', 'ch.maenulabs.rest.angular.eventify.action', function (_$q_, _$rootScope_, _action_) {
		$q = _$q_;
		$scope = _$rootScope_.$new();
		response = {};
		action = 'act';
		deferred = $q.defer();
		$scope.resource = {};
		$scope.resource[action] = jasmine.createSpy().and.returnValue(deferred.promise);
		eventifiedAction = _action_($scope, 'resource', action);
	}]));
	
	describe('arguments', function () {
		
		var argument1;
		var argument2;
		var argument3;
		
		beforeEach(function () {
			argument1 = {};
			argument2 = 1;
			argument3 = '';
		});
		
		it('should call action with arguments', function () {
			eventifiedAction(argument1, argument2, argument3);
			expect($scope.resource[action]).toHaveBeenCalledWith(argument1, argument2, argument3);
		});
		
	});
	
	describe('promise', function () {

		var resolved;
		var rejected;
		var notified;
		
		beforeEach(function () {
			resolved = jasmine.createSpy();
			rejected = jasmine.createSpy();
			notified = jasmine.createSpy();
		});
		
		it('should resolve', function () {
			eventifiedAction().then(resolved, rejected, notified);
			deferred.resolve(response);
			$scope.$digest();
			expect(resolved).toHaveBeenCalledWith(response);
			expect(rejected).not.toHaveBeenCalled();
			expect(notified).not.toHaveBeenCalled();
		});
		
		it('should reject', function () {
			eventifiedAction().then(resolved, rejected, notified);
			deferred.reject(response);
			$scope.$digest();
			expect(resolved).not.toHaveBeenCalled();
			expect(rejected).toHaveBeenCalledWith(response);
			expect(notified).not.toHaveBeenCalled();
		});
		
		it('should notify', function () {
			eventifiedAction().then(resolved, rejected, notified);
			deferred.notify(response);
			$scope.$digest();
			expect(resolved).not.toHaveBeenCalled();
			expect(rejected).not.toHaveBeenCalled();
			expect(notified).toHaveBeenCalledWith(response);
			notified.calls.reset();
			deferred.notify(response);
			$scope.$digest();
			expect(resolved).not.toHaveBeenCalled();
			expect(rejected).not.toHaveBeenCalled();
			expect(notified).toHaveBeenCalledWith(response);
		});
		
	});
	
	describe('events', function () {
		
		var pending;
		var resolved;
		var rejected;
		var notified;
		
		beforeEach(function () {
			pending = jasmine.createSpy();
			resolved = jasmine.createSpy();
			rejected = jasmine.createSpy();
			notified = jasmine.createSpy();
			$scope.$on('ch.maenulabs.rest.angular.eventify.action.Pending', pending);
			$scope.$on('ch.maenulabs.rest.angular.eventify.action.Resolved', resolved);
			$scope.$on('ch.maenulabs.rest.angular.eventify.action.Rejected', rejected);
			$scope.$on('ch.maenulabs.rest.angular.eventify.action.Notified', notified);
		});
		
		it('should call action', function () {
			eventifiedAction();
			expect($scope.resource[action]).toHaveBeenCalled();
		});

		it('should emit event on pending', function () {
			eventifiedAction();
			$scope.$digest();
			expect(pending).toHaveBeenCalled();
			expect(pending.calls.mostRecent().args[1]).toBe(action);
			expect(pending.calls.mostRecent().args[2]).toBe($scope.resource);
			expect(resolved).not.toHaveBeenCalled();
			expect(rejected).not.toHaveBeenCalled();
			expect(notified).not.toHaveBeenCalled();
		});
		
		it('should emit event on resolve', function () {
			eventifiedAction();
			$scope.$digest();
			pending.calls.reset();
			deferred.resolve(response);
			$scope.$digest();
			expect(pending).not.toHaveBeenCalled();
			expect(resolved).toHaveBeenCalled();
			expect(resolved.calls.mostRecent().args[1]).toBe(action);
			expect(resolved.calls.mostRecent().args[2]).toBe($scope.resource);
			expect(resolved.calls.mostRecent().args[3]).toBe(response);
			expect(rejected).not.toHaveBeenCalled();
			expect(notified).not.toHaveBeenCalled();
		});
		
		it('should emit event on reject', function () {
			eventifiedAction();
			$scope.$digest();
			pending.calls.reset();
			deferred.reject(response);
			$scope.$digest();
			expect(pending).not.toHaveBeenCalled();
			expect(resolved).not.toHaveBeenCalled();
			expect(rejected).toHaveBeenCalled();
			expect(rejected.calls.mostRecent().args[1]).toBe(action);
			expect(rejected.calls.mostRecent().args[2]).toBe($scope.resource);
			expect(rejected.calls.mostRecent().args[3]).toBe(response);
			expect(notified).not.toHaveBeenCalled();
		});
		
		it('should emit event on notified', function () {
			eventifiedAction();
			$scope.$digest();
			pending.calls.reset();
			deferred.notify(response);
			$scope.$digest();
			expect(pending).not.toHaveBeenCalled();
			expect(resolved).not.toHaveBeenCalled();
			expect(rejected).not.toHaveBeenCalled();
			expect(notified).toHaveBeenCalled();
			expect(notified.calls.mostRecent().args[1]).toBe(action);
			expect(notified.calls.mostRecent().args[2]).toBe($scope.resource);
			expect(notified.calls.mostRecent().args[3]).toBe(response);
			notified.calls.reset();
			deferred.notify(response);
			$scope.$digest();
			expect(pending).not.toHaveBeenCalled();
			expect(resolved).not.toHaveBeenCalled();
			expect(rejected).not.toHaveBeenCalled();
			expect(notified).toHaveBeenCalled();
			expect(notified.calls.mostRecent().args[1]).toBe(action);
			expect(notified.calls.mostRecent().args[2]).toBe($scope.resource);
			expect(notified.calls.mostRecent().args[3]).toBe(response);
		});
		
	});

});
