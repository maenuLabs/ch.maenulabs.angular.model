/* global describe, it, beforeEach, expect, jasmine, module, inject */
describe('DeleteFactory', function () {

	var $scope;
	var eventifyAction;
	var eventifiedAction;
	var resource;
	var Delete;
	
	beforeEach(module('ch.maenulabs.rest.angular.controller', function($provide) {
		eventifiedAction = jasmine.createSpy();
		eventifyAction = jasmine.createSpy().and.returnValue(eventifiedAction);
		$provide.value('ch.maenulabs.rest.angular.service.eventifyAction', eventifyAction);
    }));

	beforeEach(inject(['$controller', '$rootScope', 'ch.maenulabs.rest.angular.controller.DeleteFactory', function (_$controller_, _$rootScope_, _DeleteFactory_) {
		resource = {};
		$scope = _$rootScope_.$new();
		Delete = _$controller_(_DeleteFactory_, {
			'$scope': $scope,
			'resource': resource
		});
	}]));

	it('should eventify the resource\'s delete', function () {
		expect(eventifyAction).toHaveBeenCalledWith($scope, resource, 'delete');
		expect($scope.delete).toBe(eventifiedAction);
	});

});
