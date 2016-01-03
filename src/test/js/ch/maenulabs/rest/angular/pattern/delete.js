/* global describe, it, beforeEach, expect, jasmine, module, inject */
describe('delete', function () {

	var $scope;
	var actionReturnValue;
	var action;
	var deleteReturnValue;
	
	beforeEach(module('ch.maenulabs.rest.angular.pattern', function($provide) {
		actionReturnValue = jasmine.createSpy();
		action = jasmine.createSpy().and.returnValue(actionReturnValue);
		$provide.value('ch.maenulabs.rest.angular.eventify.action', action);
    }));

	beforeEach(inject(['$rootScope', 'ch.maenulabs.rest.angular.pattern.delete', function (_$rootScope_, _delete_) {
		$scope = _$rootScope_.$new();
		deleteReturnValue = _delete_($scope, 'resource');
	}]));

	it('should eventify the resource\'s delete', function () {
		expect(action).toHaveBeenCalledWith($scope, 'resource', 'delete');
		expect(deleteReturnValue).toBe(actionReturnValue);
	});

});
