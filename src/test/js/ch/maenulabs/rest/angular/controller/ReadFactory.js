/* global describe, it, beforeEach, expect, jasmine, module, inject */
describe('ReadFactory', function () {

	var $scope;
	var eventifyAction;
	var eventifiedAction;
	var resource;
	var controller;
	
	beforeEach(module('ch.maenulabs.rest.angular.controller', function($provide) {
		eventifiedAction = jasmine.createSpy();
		eventifyAction = jasmine.createSpy().and.returnValue(eventifiedAction);
		$provide.value('ch.maenulabs.rest.angular.service.eventifyAction', eventifyAction);
    }));

	beforeEach(inject(['$controller', '$rootScope', 'ch.maenulabs.rest.angular.controller.ReadFactory', function (_$controller_, _$rootScope_, _ReadFactory_) {
		resource = {};
		$scope = _$rootScope_.$new();
		controller = _$controller_(_ReadFactory_, {
			'$scope': $scope,
			'resource': resource
		});
	}]));

	it('should eventify the resource\'s read', function () {
		expect(eventifyAction).toHaveBeenCalledWith($scope, resource, 'read');
		expect(controller.read).toBe(eventifiedAction);
	});

});
