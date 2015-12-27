/* global describe, it, beforeEach, expect, jasmine, module, inject */
describe('Search', function () {

	var $scope;
	var eventifiedSchedule;
	var eventifiedAction;
	var eventifySchedule;
	var eventifyChange;
	var eventifyAction;
	var delay;
	var changeables;
	var resource;
	var controller;
	
	beforeEach(module('ch.maenulabs.rest.angular.controller', function($provide) {
		eventifiedSchedule = jasmine.createSpy();
		eventifiedAction = jasmine.createSpy();
		eventifySchedule = jasmine.createSpy().and.returnValue(eventifiedSchedule);
		eventifyChange = jasmine.createSpy();
		eventifyAction = jasmine.createSpy().and.returnValue(eventifiedAction);
		$provide.value('ch.maenulabs.rest.angular.event.eventifySchedule', eventifySchedule);
		$provide.value('ch.maenulabs.rest.angular.event.eventifyChange', eventifyChange);
		$provide.value('ch.maenulabs.rest.angular.event.eventifyAction', eventifyAction);
    }));

	beforeEach(inject(['$controller', '$rootScope', function (_$controller_, _$rootScope_) {
		delay = 300;
		changeables = [];
		resource = {
			getChangeables: jasmine.createSpy().and.returnValue(changeables)
		};
		$scope = _$rootScope_.$new();
		controller = _$controller_('ch.maenulabs.rest.angular.controller.Search', {
			'$scope': $scope,
			'resource': resource,
			'delay': delay
		});
	}]));

	it('should set the resource on the controller', function () {
		expect(controller.resource).toBe(resource);
	});

	it('should eventify the resource\'s change', function () {
		expect(eventifyChange).toHaveBeenCalledWith($scope, resource);
	});

	it('should eventify the resource\'s search', function () {
		expect(eventifyAction).toHaveBeenCalledWith($scope, resource, 'search');
		expect(controller.search).toBe(eventifiedAction);
	});
	
	describe('done', function () {

		it('should search when schedule is done', function () {
			expect(eventifiedAction).not.toHaveBeenCalled();
			$scope.$emit('ch.maenulabs.rest.angular.resource.Changed', resource);
			$scope.$emit('ch.maenulabs.rest.angular.event.schedule.Done', eventifiedSchedule);
			$scope.$digest();
			expect(eventifiedAction).toHaveBeenCalled();
		});

		it('should not search when another schedule is done', function () {
			expect(eventifiedAction).not.toHaveBeenCalled();
			$scope.$emit('ch.maenulabs.rest.angular.resource.Changed', resource);
			$scope.$emit('ch.maenulabs.rest.angular.event.schedule.Done', null);
			$scope.$digest();
			expect(eventifiedAction).not.toHaveBeenCalled();
		});
		
	});
	
	describe('change', function () {

		it('should eventify the schedule on the resource\'s change', function () {
			expect(eventifySchedule).not.toHaveBeenCalled();
			$scope.$emit('ch.maenulabs.rest.angular.resource.Changed', resource);
			$scope.$digest();
			expect(eventifySchedule).toHaveBeenCalledWith($scope, delay);
		});

		it('should not eventify the schedule on the resource\'s change', function () {
			expect(eventifySchedule).not.toHaveBeenCalled();
			$scope.$emit('ch.maenulabs.rest.angular.resource.Changed', null);
			$scope.$digest();
			expect(eventifySchedule).not.toHaveBeenCalledWith($scope, delay);
		});

		it('should cancel the old schedule on multiple changes', function () {
			expect(eventifiedSchedule).not.toHaveBeenCalled();
			$scope.$emit('ch.maenulabs.rest.angular.resource.Changed', resource);
			$scope.$digest();
			expect(eventifiedSchedule).not.toHaveBeenCalled();
			$scope.$emit('ch.maenulabs.rest.angular.resource.Changed', resource);
			$scope.$digest();
			expect(eventifiedSchedule).toHaveBeenCalled();
		});
		
	});

	it('should not cancel the old schedule on done', function () {
		expect(eventifiedSchedule).not.toHaveBeenCalled();
		$scope.$emit('ch.maenulabs.rest.angular.resource.Changed', resource);
		$scope.$digest();
		expect(eventifiedSchedule).not.toHaveBeenCalled();
		$scope.$emit('ch.maenulabs.rest.angular.event.schedule.Done', eventifiedSchedule);
		$scope.$digest();
		expect(eventifiedSchedule).not.toHaveBeenCalled();
		$scope.$emit('ch.maenulabs.rest.angular.resource.Changed', resource);
		$scope.$digest();
		expect(eventifiedSchedule).not.toHaveBeenCalled();
		$scope.$emit('ch.maenulabs.rest.angular.resource.Changed', resource);
		$scope.$digest();
		expect(eventifiedSchedule).toHaveBeenCalled();
	});

});
