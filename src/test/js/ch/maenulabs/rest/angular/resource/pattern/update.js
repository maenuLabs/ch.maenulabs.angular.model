/* global describe, it, beforeEach, expect, jasmine, module, inject */
describe('Update', function () {

	var $scope;
	var validation;
	var change;
	var action;
	var eventifiedAction;
	var changeables;
	var resource;
	var controller;
	
	beforeEach(module('ch.maenulabs.rest.angular.resource.pattern', function($provide) {
		eventifiedAction = jasmine.createSpy();
		validation = jasmine.createSpy();
		change = jasmine.createSpy();
		action = jasmine.createSpy().and.returnValue(eventifiedAction);
		$provide.value('ch.maenulabs.rest.angular.resource.eventify.validation', validation);
		$provide.value('ch.maenulabs.rest.angular.resource.eventify.change', change);
		$provide.value('ch.maenulabs.rest.angular.resource.eventify.action', action);
    }));

	beforeEach(inject(['$controller', '$rootScope', function (_$controller_, _$rootScope_) {
		changeables = [];
		resource = {
			getChangeables: jasmine.createSpy().and.returnValue(changeables)
		};
		$scope = _$rootScope_.$new();
		controller = _$controller_('ch.maenulabs.rest.angular.resource.pattern.Update', {
			'$scope': $scope,
			'resource': resource
		});
	}]));

	it('should set the resource on the controller', function () {
		expect(controller.resource).toBe(resource);
	});

	it('should eventify the resource\'s validation', function () {
		expect(validation).toHaveBeenCalledWith($scope, resource);
	});

	it('should eventify the resource\'s change', function () {
		expect(change).toHaveBeenCalledWith($scope, resource);
	});

	it('should eventify the resource\'s update', function () {
		expect(action).toHaveBeenCalledWith($scope, resource, 'update');
		expect(controller.update).toBe(eventifiedAction);
	});

});
