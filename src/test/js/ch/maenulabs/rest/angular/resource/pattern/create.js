/* global describe, it, beforeEach, expect, jasmine, module, inject */
describe('create', function () {

	var $scope;
	var actionReturnValue;
	var validation;
	var action;
	var createReturnValue;
	
	beforeEach(module('ch.maenulabs.rest.angular.resource.pattern', function($provide) {
		actionReturnValue = jasmine.createSpy();
		validation = jasmine.createSpy();
		action = jasmine.createSpy().and.returnValue(actionReturnValue);
		$provide.value('ch.maenulabs.rest.angular.resource.eventify.validation', validation);
		$provide.value('ch.maenulabs.rest.angular.resource.eventify.action', action);
    }));

	beforeEach(inject(['$rootScope', 'ch.maenulabs.rest.angular.resource.pattern.create', function (_$rootScope_, _create_) {
		$scope = _$rootScope_.$new();
		createReturnValue = _create_($scope, 'resource');
	}]));

	it('should eventify the resource\'s validation', function () {
		expect(validation).toHaveBeenCalledWith($scope, 'resource');
	});

	it('should eventify the resource\'s create', function () {
		expect(action).toHaveBeenCalledWith($scope, 'resource', 'create');
		expect(createReturnValue).toBe(actionReturnValue);
	});

});
