/* global describe, it, beforeEach, expect, jasmine, module, inject */
describe('SearchFactory', function () {

	var $scope;
	var eventifiedSchedule;
	var eventifiedAction;
	var eventifySchedule;
	var eventifyChange;
	var eventifyAction;
	var delay;
	var changeables;
	var resource;
	var Search;
	
	beforeEach(module('ch.maenulabs.rest.angular.controller', function($provide) {
		eventifiedSchedule = jasmine.createSpy();
		eventifiedAction = jasmine.createSpy();
		eventifySchedule = jasmine.createSpy().and.returnValue(eventifiedSchedule);
		eventifyChange = jasmine.createSpy();
		eventifyAction = jasmine.createSpy().and.returnValue(eventifiedAction);
		$provide.value('ch.maenulabs.rest.angular.service.eventifySchedule', eventifySchedule);
		$provide.value('ch.maenulabs.rest.angular.service.eventifyChange', eventifyChange);
		$provide.value('ch.maenulabs.rest.angular.service.eventifyAction', eventifyAction);
    }));

	beforeEach(inject(['$controller', '$rootScope', 'ch.maenulabs.rest.angular.controller.SearchFactory', function (_$controller_, _$rootScope_, _SearchFactory_) {
		delay = 300;
		changeables = [];
		resource = {
			getChangeables: jasmine.createSpy().and.returnValue(changeables)
		};
		$scope = _$rootScope_.$new();
		Search = _$controller_(_SearchFactory_, {
			'$scope': $scope,
			'resource': resource,
			'delay': delay
		});
	}]));

	it('should eventify the resource\'s change', function () {
		expect(eventifyChange).toHaveBeenCalledWith($scope, resource);
	});

	it('should eventify the resource\'s search', function () {
		expect(eventifyAction).toHaveBeenCalledWith($scope, resource, 'search');
		expect($scope.search).toBe(eventifiedAction);
	});

	it('should search when schedule is done', function () {
		expect(eventifiedAction).not.toHaveBeenCalled();
		$scope.$emit('ch.maenulabs.rest.angular.service.schedule.Done');
		$scope.$digest();
		expect(eventifiedAction).toHaveBeenCalled();
	});

	it('should eventify the schedule on the resource\'s change', function () {
		expect(eventifySchedule).not.toHaveBeenCalled();
		$scope.$emit('ch.maenulabs.rest.angular.resource.Changed');
		$scope.$digest();
		expect(eventifySchedule).toHaveBeenCalledWith($scope, delay);
	});

	it('should cancel the old schedule on multiple changes', function () {
		expect(eventifiedSchedule).not.toHaveBeenCalled();
		$scope.$emit('ch.maenulabs.rest.angular.resource.Changed');
		$scope.$digest();
		expect(eventifiedSchedule).not.toHaveBeenCalled();
		$scope.$emit('ch.maenulabs.rest.angular.resource.Changed');
		$scope.$digest();
		expect(eventifiedSchedule).toHaveBeenCalled();
	});

	it('should not cancel the old schedule on done', function () {
		expect(eventifiedSchedule).not.toHaveBeenCalled();
		$scope.$emit('ch.maenulabs.rest.angular.resource.Changed');
		$scope.$digest();
		expect(eventifiedSchedule).not.toHaveBeenCalled();
		$scope.$emit('ch.maenulabs.rest.angular.service.schedule.Done');
		$scope.$digest();
		expect(eventifiedSchedule).not.toHaveBeenCalled();
		$scope.$emit('ch.maenulabs.rest.angular.resource.Changed');
		$scope.$digest();
		expect(eventifiedSchedule).not.toHaveBeenCalled();
		$scope.$emit('ch.maenulabs.rest.angular.resource.Changed');
		$scope.$digest();
		expect(eventifiedSchedule).toHaveBeenCalled();
	});

});
