/* global describe, it, beforeEach, expect, jasmine, module, inject */
describe('eventifyChange', function () {

	var $scope;
	var changedables;
	var eventifyedChange;
	
	beforeEach(module('ch.maenulabs.rest.angular.service'));

	beforeEach(inject(['$rootScope', 'ch.maenulabs.rest.angular.service.eventifyChange', function (_$rootScope_, _eventifyChange_) {
		$scope = _$rootScope_.$new();
		changedables = ['key'];
		$scope.resource = {
			getChangeables: function () {
				return changedables;
			}
		};
		eventifyedChange = _eventifyChange_($scope, $scope.resource);
	}]));
	
	describe('events', function () {
		
		var changed;
		
		beforeEach(function () {
			changed = jasmine.createSpy();
			$scope.$on('ch.maenulabs.rest.angular.resource.Changed', changed);
		});
		
		it('should emit event on changed', function () {
			$scope.$digest();
			expect(changed).toHaveBeenCalled();
			expect(changed.calls.mostRecent().args[1]).toBe($scope.resource);
		});
		
		it('should deregister', function () {
			eventifyedChange();
			$scope.$digest();
			expect(changed).not.toHaveBeenCalled();
		});
		
	});

});
