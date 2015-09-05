/* global describe, it, beforeEach, expect, jasmine, module, inject */
describe('UpdateFactory', function () {

	var $scope;
	var eventifyValidation;
	var eventifyChange;
	var eventifyAction;
	var eventifiedAction;
	var changeables;
	var resource;
	var Update;
	
	beforeEach(module('ng', 'ch.maenulabs.rest.angular.controller', function($provide) {
		eventifiedAction = jasmine.createSpy();
		eventifyValidation = jasmine.createSpy();
		eventifyChange = jasmine.createSpy();
		eventifyAction = jasmine.createSpy().and.returnValue(eventifiedAction);
		$provide.value('ch.maenulabs.rest.angular.service.eventifyValidation', eventifyValidation);
		$provide.value('ch.maenulabs.rest.angular.service.eventifyChange', eventifyChange);
		$provide.value('ch.maenulabs.rest.angular.service.eventifyAction', eventifyAction);
    }));

	beforeEach(inject(['$controller', '$rootScope', 'ch.maenulabs.rest.angular.controller.UpdateFactory', function (_$controller_, _$rootScope_, _UpdateFactory_) {
		changeables = [];
		resource = {
			getChangeables: jasmine.createSpy().and.returnValue(changeables)
		};
		$scope = _$rootScope_.$new();
		Update = _$controller_(_UpdateFactory_, {
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

	it('should eventify the resource\'s change', function () {
		expect(eventifyChange).toHaveBeenCalledWith($scope, $scope.resource);
	});

	it('should eventify the resource\'s update', function () {
		expect(eventifyAction).toHaveBeenCalledWith($scope, $scope.resource, 'update');
		expect($scope.update).toBe(eventifiedAction);
	});

});
