/* global describe, it, beforeEach, expect, jasmine, module, inject */
describe('CreateFactory', function () {

	var $scope;
	var eventifyValidation;
	var eventifyAction;
	var eventifiedAction;
	var resource;
	var Create;
	
	beforeEach(module('ng', 'ch.maenulabs.rest.angular.controller', function($provide) {
		eventifiedAction = jasmine.createSpy();
		eventifyValidation = jasmine.createSpy();
		eventifyAction = jasmine.createSpy().and.returnValue(eventifiedAction);
		$provide.value('ch.maenulabs.rest.angular.service.eventifyValidation', eventifyValidation);
		$provide.value('ch.maenulabs.rest.angular.service.eventifyAction', eventifyAction);
    }));

	beforeEach(inject(['$controller', '$rootScope', 'ch.maenulabs.rest.angular.controller.CreateFactory', function (_$controller_, _$rootScope_, _CreateFactory_) {
		resource = {};
		$scope = _$rootScope_.$new();
		Create = _$controller_(_CreateFactory_, {
			'$scope': $scope,
			'resource': resource
		});
	}]));

	it('should set the resource on the scope', function () {
		expect($scope.resource).toBe(resource);
	});

	it('should eventify the resource\'s validation', function () {
		expect(eventifyValidation).toHaveBeenCalledWith($scope, $scope.resource);
	});

	it('should eventify the resource\'s create', function () {
		expect(eventifyAction).toHaveBeenCalledWith($scope, $scope.resource, 'create');
		expect($scope.create).toBe(eventifiedAction);
	});

});
