/* global describe, it, beforeEach, expect, jasmine, module, inject */
describe('Read', function () {

	var $scope;
	var eventifyAction;
	var eventifiedAction;
	var resource;
	var controller;
	
	beforeEach(module('ch.maenulabs.rest.angular.controller', function($provide) {
		eventifiedAction = jasmine.createSpy();
		eventifyAction = jasmine.createSpy().and.returnValue(eventifiedAction);
		$provide.value('ch.maenulabs.rest.angular.event.eventifyAction', eventifyAction);
    }));

	beforeEach(inject(['$controller', '$rootScope', function (_$controller_, _$rootScope_) {
		resource = {};
		$scope = _$rootScope_.$new();
		controller = _$controller_('ch.maenulabs.rest.angular.controller.Read', {
			'$scope': $scope,
			'resource': resource
		});
	}]));

	it('should set the resource on the controller', function () {
		expect(controller.resource).toBe(resource);
	});

	it('should eventify the resource\'s read', function () {
		expect(eventifyAction).toHaveBeenCalledWith($scope, resource, 'read');
		expect(controller.read).toBe(eventifiedAction);
	});

});