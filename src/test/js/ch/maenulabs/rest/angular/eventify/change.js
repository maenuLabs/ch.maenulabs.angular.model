/* global describe, it, beforeEach, expect, jasmine, module, inject */
describe('change', function () {

	var $scope;
	var changeables;
	var unwatch;
	
	beforeEach(module('ch.maenulabs.rest.angular.eventify'));

	beforeEach(inject(['$rootScope', 'ch.maenulabs.rest.angular.eventify.change', function (_$rootScope_, _change_) {
		$scope = _$rootScope_.$new();
		changeables = ['key'];
		$scope.resource = {};
		unwatch = _change_($scope, 'resource', changeables);
	}]));
	
	describe('events', function () {
		
		var changed;
		
		beforeEach(function () {
			changed = jasmine.createSpy();
			$scope.$on('ch.maenulabs.rest.angular.eventify.change.Changed', changed);
		});
		
		describe('emission', function () {
			
			beforeEach(function () {
				$scope.$digest();
			});
			
			it('should emit event on init', function () {
				expect(changed).toHaveBeenCalled();
				expect(changed.calls.count()).toEqual(1);
				expect(changed.calls.mostRecent().args[1]).toBe($scope.resource);
			});
		
			it('should emit event on change in changeables', function () {
				changed.calls.reset();
				$scope.resource[changeables[0]] = 'value';
				$scope.$digest();
				expect(changed).toHaveBeenCalled();
				expect(changed.calls.count()).toEqual(1);
				expect(changed.calls.mostRecent().args[1]).toBe($scope.resource);
			});
			
		});
		
		describe('unwatching', function () {
			
			beforeEach(function () {
				unwatch();
				$scope.$digest();
			});
			
			it('should not emit event on init', function () {
				expect(changed).not.toHaveBeenCalled();
			});
		
			it('should not emit event on change in changeables', function () {
				$scope.resource[changeables[0]] = 'value';
				$scope.$digest();
				expect(changed).not.toHaveBeenCalled();
			});
			
		});
		
	});

});
