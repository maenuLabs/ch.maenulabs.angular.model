/* global describe, it, beforeEach, expect, jasmine, module, inject */
describe('Create', function () {

	var $scope;
	var validation;
	var action;
	var eventifiedAction;
	var resource;
	var controller;
	
	beforeEach(module('ch.maenulabs.rest.angular.resource.pattern', function($provide) {
		eventifiedAction = jasmine.createSpy();
		validation = jasmine.createSpy();
		action = jasmine.createSpy().and.returnValue(eventifiedAction);
		$provide.value('ch.maenulabs.rest.angular.resource.eventify.validation', validation);
		$provide.value('ch.maenulabs.rest.angular.resource.eventify.action', action);
    }));

	beforeEach(inject(['$controller', '$rootScope', function (_$controller_, _$rootScope_) {
		resource = {};
		$scope = _$rootScope_.$new();
		controller = _$controller_('ch.maenulabs.rest.angular.resource.pattern.Create', {
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

	it('should eventify the resource\'s create', function () {
		expect(action).toHaveBeenCalledWith($scope, resource, 'create');
		expect(controller.create).toBe(eventifiedAction);
	});

});
