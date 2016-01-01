/* global describe, it, beforeEach, expect, jasmine, module, inject */
describe('search', function () {

	var $timeout;
	var $scope;
	var changeReturnValue;
	var actionReturnValue;
	var change;
	var action;
	var delay;
	var searchReturnValue;
	
	beforeEach(module('ch.maenulabs.rest.angular.resource.pattern', function($provide) {
		changeReturnValue = jasmine.createSpy();
		actionReturnValue = jasmine.createSpy();
		change = jasmine.createSpy().and.returnValue(changeReturnValue);
		action = jasmine.createSpy().and.returnValue(actionReturnValue);
		$provide.value('ch.maenulabs.rest.angular.resource.eventify.change', change);
		$provide.value('ch.maenulabs.rest.angular.resource.eventify.action', action);
    }));

	beforeEach(inject(['$rootScope', '$timeout', 'ch.maenulabs.rest.angular.resource.pattern.search', function (_$rootScope_, _$timeout_, _search_) {
		$timeout = _$timeout_;
		delay = 300;
		$scope = _$rootScope_.$new();
		$scope.resource = {};
		searchReturnValue = _search_($scope, 'resource', delay)();
	}]));

	it('should eventify the resource\'s change', function () {
		expect(change).toHaveBeenCalledWith($scope, 'resource');
	});

	it('should eventify the resource\'s search', function () {
		expect(action).toHaveBeenCalledWith($scope, 'resource', 'search');
	});
	
	describe('delay', function () {

		it('should search after change and timeout', function () {
			expect(actionReturnValue).not.toHaveBeenCalled();
			$scope.$emit('ch.maenulabs.rest.angular.resource.eventify.change.Changed', $scope.resource);
			$timeout.flush(delay - 1);
			$scope.$digest();
			expect(actionReturnValue).not.toHaveBeenCalled();
			$timeout.flush(1);
			$scope.$digest();
			expect(actionReturnValue).toHaveBeenCalled();
		});

		it('should search after second change and timeout', function () {
			expect(actionReturnValue).not.toHaveBeenCalled();
			$scope.$emit('ch.maenulabs.rest.angular.resource.eventify.change.Changed', $scope.resource);
			$timeout.flush(delay);
			$scope.$digest();
			expect(actionReturnValue).toHaveBeenCalled();
			actionReturnValue.calls.reset();
			$scope.$emit('ch.maenulabs.rest.angular.resource.eventify.change.Changed', $scope.resource);
			$timeout.flush(delay);
			$scope.$digest();
			expect(actionReturnValue).toHaveBeenCalled();
		});

		it('should not search after other resource changes and timeout', function () {
			expect(actionReturnValue).not.toHaveBeenCalled();
			$scope.$emit('ch.maenulabs.rest.angular.resource.eventify.change.Changed', null);
			$timeout.flush(delay);
			$scope.$digest();
			expect(actionReturnValue).not.toHaveBeenCalled();
		});

		it('should prolong the timeout on change before timeout expires', function () {
			expect(actionReturnValue).not.toHaveBeenCalled();
			$scope.$emit('ch.maenulabs.rest.angular.resource.eventify.change.Changed', $scope.resource);
			$timeout.flush(delay - 1);
			$scope.$digest();
			expect(actionReturnValue).not.toHaveBeenCalled();
			$scope.$emit('ch.maenulabs.rest.angular.resource.eventify.change.Changed', $scope.resource);
			$timeout.flush(delay - 1);
			$scope.$digest();
			expect(actionReturnValue).not.toHaveBeenCalled();
			$timeout.flush(1);
			$scope.$digest();
			expect(actionReturnValue).toHaveBeenCalled();
		});

		it('should cancel the timeout on unwatch before timeout expires', function () {
			expect(actionReturnValue).not.toHaveBeenCalled();
			$scope.$emit('ch.maenulabs.rest.angular.resource.eventify.change.Changed', $scope.resource);
			$timeout.flush(delay - 1);
			$scope.$digest();
			expect(actionReturnValue).not.toHaveBeenCalled();
			searchReturnValue();
			$timeout.flush(1);
			$scope.$digest();
			expect(actionReturnValue).toHaveBeenCalled();
		});
		
	});

});
