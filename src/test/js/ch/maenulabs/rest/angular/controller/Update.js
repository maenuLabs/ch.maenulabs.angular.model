/* global describe, it, beforeEach, expect, jasmine, module, inject */
describe('Update', function () {

	var $scope;
	var eventifyValidation;
	var eventifyChange;
	var eventifyAction;
	var eventifiedAction;
	var changeables;
	var resource;
	var controller;
	
	beforeEach(module('ch.maenulabs.rest.angular.controller', function($provide) {
		eventifiedAction = jasmine.createSpy();
		eventifyValidation = jasmine.createSpy();
		eventifyChange = jasmine.createSpy();
		eventifyAction = jasmine.createSpy().and.returnValue(eventifiedAction);
		$provide.value('ch.maenulabs.rest.angular.event.eventifyValidation', eventifyValidation);
		$provide.value('ch.maenulabs.rest.angular.event.eventifyChange', eventifyChange);
		$provide.value('ch.maenulabs.rest.angular.event.eventifyAction', eventifyAction);
    }));

	beforeEach(inject(['$controller', '$rootScope', function (_$controller_, _$rootScope_) {
		changeables = [];
		resource = {
			getChangeables: jasmine.createSpy().and.returnValue(changeables)
		};
		$scope = _$rootScope_.$new();
		controller = _$controller_('ch.maenulabs.rest.angular.controller.Update', {
			'$scope': $scope,
			'resource': resource
		});
	}]));

	it('should set the resource on the controller', function () {
		expect(controller.resource).toBe(resource);
	});

	it('should eventify the resource\'s validation', function () {
		expect(eventifyValidation).toHaveBeenCalledWith($scope, resource);
	});

	it('should eventify the resource\'s change', function () {
		expect(eventifyChange).toHaveBeenCalledWith($scope, resource);
	});

	it('should eventify the resource\'s update', function () {
		expect(eventifyAction).toHaveBeenCalledWith($scope, resource, 'update');
		expect(controller.update).toBe(eventifiedAction);
	});

});
