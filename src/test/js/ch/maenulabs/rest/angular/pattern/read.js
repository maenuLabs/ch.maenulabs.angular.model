/* global describe, it, beforeEach, expect, jasmine, module, inject */
describe('read', function () {

	var $scope;
	var actionReturnValue;
	var action;
	var readReturnValue;
	
	beforeEach(module('ch.maenulabs.rest.angular.pattern', function($provide) {
		actionReturnValue = jasmine.createSpy();
		action = jasmine.createSpy().and.returnValue(actionReturnValue);
		$provide.value('ch.maenulabs.rest.angular.eventify.action', action);
    }));

	beforeEach(inject(['$rootScope', 'ch.maenulabs.rest.angular.pattern.read', function (_$rootScope_, _read_) {
		$scope = _$rootScope_.$new();
		readReturnValue = _read_($scope, 'resource');
	}]));

	it('should eventify the resource\'s read', function () {
		expect(action).toHaveBeenCalledWith($scope, 'resource', 'read');
		expect(readReturnValue).toBe(actionReturnValue);
	});

});
