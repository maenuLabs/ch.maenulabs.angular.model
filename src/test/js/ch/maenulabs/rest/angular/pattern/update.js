/* global describe, it, beforeEach, expect, jasmine, module, inject */
describe('update', function () {

	var $scope;
	var actionReturnValue;
	var validation;
	var action;
	var change;
	var updateReturnValue;
	
	beforeEach(module('ch.maenulabs.rest.angular.pattern', function($provide) {
		actionReturnValue = jasmine.createSpy();
		validation = jasmine.createSpy();
		action = jasmine.createSpy().and.returnValue(actionReturnValue);
		change = jasmine.createSpy();
		$provide.value('ch.maenulabs.rest.angular.eventify.validation', validation);
		$provide.value('ch.maenulabs.rest.angular.eventify.action', action);
		$provide.value('ch.maenulabs.rest.angular.eventify.change', change);
    }));

	beforeEach(inject(['$rootScope', 'ch.maenulabs.rest.angular.pattern.update', function (_$rootScope_, _update_) {
		$scope = _$rootScope_.$new();
		updateReturnValue = _update_($scope, 'resource');
	}]));

	it('should eventify the resource\'s change', function () {
		expect(change).toHaveBeenCalledWith($scope, 'resource');
	});

	it('should eventify the resource\'s validation', function () {
		expect(validation).toHaveBeenCalledWith($scope, 'resource');
	});

	it('should eventify the resource\'s update', function () {
		expect(action).toHaveBeenCalledWith($scope, 'resource', 'update');
		expect(updateReturnValue).toBe(actionReturnValue);
	});

});
