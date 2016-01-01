/* global describe, it, beforeEach, expect, jasmine, module, inject */
describe('search', function () {

	var $scope;
	var eventifiedSchedule;
	var eventifiedAction;
	var timeout;
	var change;
	var action;
	var delay;
	var changeables;
	var resource;
	var controller;
	
	beforeEach(module('ch.maenulabs.rest.angular.resource.pattern', function($provide) {
		eventifiedSchedule = jasmine.createSpy();
		eventifiedAction = jasmine.createSpy();
		timeout = jasmine.createSpy().and.returnValue(eventifiedSchedule);
		change = jasmine.createSpy();
		action = jasmine.createSpy().and.returnValue(eventifiedAction);
		$provide.value('ch.maenulabs.rest.angular.resource.eventify.timeout', timeout);
		$provide.value('ch.maenulabs.rest.angular.resource.eventify.change', change);
		$provide.value('ch.maenulabs.rest.angular.resource.eventify.action', action);
    }));

	beforeEach(inject(['$rootScope', 'ch.maenulabs.rest.angular.resource.pattern.Search', function (_$rootScope_, _search_) {
		delay = 300;
		changeables = [];
		resource = {
			getChangeables: jasmine.createSpy().and.returnValue(changeables)
		};
		$scope = _$rootScope_.$new();
		controller = _search_($scope, 'resource', delay);
	}]));

	it('should set the resource on the controller', function () {
		expect(controller.resource).toBe(resource);
	});

	it('should eventify the resource\'s change', function () {
		expect(change).toHaveBeenCalledWith($scope, resource);
	});

	it('should eventify the resource\'s search', function () {
		expect(action).toHaveBeenCalledWith($scope, resource, 'search');
		expect(controller.search).toBe(eventifiedAction);
	});
	
	describe('done', function () {

		it('should search when schedule is done', function () {
			expect(eventifiedAction).not.toHaveBeenCalled();
			$scope.$emit('ch.maenulabs.rest.angular.resource.eventify.change.Changed', resource);
			$scope.$emit('ch.maenulabs.rest.angular.resource.eventify.timeout.Done', eventifiedSchedule);
			$scope.$digest();
			expect(eventifiedAction).toHaveBeenCalled();
		});

		it('should not search when another schedule is done', function () {
			expect(eventifiedAction).not.toHaveBeenCalled();
			$scope.$emit('ch.maenulabs.rest.angular.resource.eventify.change.Changed', resource);
			$scope.$emit('ch.maenulabs.rest.angular.resource.eventify.timeout.Done', null);
			$scope.$digest();
			expect(eventifiedAction).not.toHaveBeenCalled();
		});
		
	});
	
	describe('change', function () {

		it('should eventify the schedule on the resource\'s change', function () {
			expect(timeout).not.toHaveBeenCalled();
			$scope.$emit('ch.maenulabs.rest.angular.resource.eventify.change.Changed', resource);
			$scope.$digest();
			expect(timeout).toHaveBeenCalledWith($scope, delay);
		});

		it('should not eventify the schedule on the resource\'s change', function () {
			expect(timeout).not.toHaveBeenCalled();
			$scope.$emit('ch.maenulabs.rest.angular.resource.eventify.change.Changed', null);
			$scope.$digest();
			expect(timeout).not.toHaveBeenCalledWith($scope, delay);
		});

		it('should cancel the old schedule on multiple changes', function () {
			expect(eventifiedSchedule).not.toHaveBeenCalled();
			$scope.$emit('ch.maenulabs.rest.angular.resource.eventify.change.Changed', resource);
			$scope.$digest();
			expect(eventifiedSchedule).not.toHaveBeenCalled();
			$scope.$emit('ch.maenulabs.rest.angular.resource.eventify.change.Changed', resource);
			$scope.$digest();
			expect(eventifiedSchedule).toHaveBeenCalled();
		});
		
	});

	it('should not cancel the old schedule on done', function () {
		expect(eventifiedSchedule).not.toHaveBeenCalled();
		$scope.$emit('ch.maenulabs.rest.angular.resource.eventify.change.Changed', resource);
		$scope.$digest();
		expect(eventifiedSchedule).not.toHaveBeenCalled();
		$scope.$emit('ch.maenulabs.rest.angular.resource.eventify.timeout.Done', eventifiedSchedule);
		$scope.$digest();
		expect(eventifiedSchedule).not.toHaveBeenCalled();
		$scope.$emit('ch.maenulabs.rest.angular.resource.eventify.change.Changed', resource);
		$scope.$digest();
		expect(eventifiedSchedule).not.toHaveBeenCalled();
		$scope.$emit('ch.maenulabs.rest.angular.resource.eventify.change.Changed', resource);
		$scope.$digest();
		expect(eventifiedSchedule).toHaveBeenCalled();
	});

});
