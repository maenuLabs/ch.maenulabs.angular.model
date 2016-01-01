/* global describe, it, beforeEach, expect, jasmine, module, inject */
describe('Read', function () {

	var $scope;
	var action;
	var eventifiedAction;
	var resource;
	var controller;
	
	beforeEach(module('ch.maenulabs.rest.angular.resource.pattern', function($provide) {
		eventifiedAction = jasmine.createSpy();
		action = jasmine.createSpy().and.returnValue(eventifiedAction);
		$provide.value('ch.maenulabs.rest.angular.resource.eventify.action', action);
    }));

	beforeEach(inject(['$controller', '$rootScope', function (_$controller_, _$rootScope_) {
		resource = {};
		$scope = _$rootScope_.$new();
		controller = _$controller_('ch.maenulabs.rest.angular.resource.pattern.Read', {
			'$scope': $scope,
			'resource': resource
		});
	}]));

	it('should set the resource on the controller', function () {
		expect(controller.resource).toBe(resource);
	});

	it('should eventify the resource\'s read', function () {
		expect(action).toHaveBeenCalledWith($scope, resource, 'read');
		expect(controller.read).toBe(eventifiedAction);
	});

});
