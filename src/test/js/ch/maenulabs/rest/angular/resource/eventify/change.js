/* global describe, it, beforeEach, expect, jasmine, module, inject */
describe('change', function () {

	var $scope;
	var unwatch;
	
	beforeEach(module('ch.maenulabs.rest.angular.resource.eventify'));

	beforeEach(inject(['$rootScope', 'ch.maenulabs.rest.angular.resource.eventify.change', function (_$rootScope_, _change_) {
		$scope = _$rootScope_.$new();
		$scope.resource = {
			getChangeables: function () {
				return ['key'];
			}
		};
		unwatch = _change_($scope, 'resource');
	}]));
	
	describe('events', function () {
		
		var changed;
		
		beforeEach(function () {
			changed = jasmine.createSpy();
			$scope.$on('ch.maenulabs.rest.angular.resource.eventify.change.Changed', changed);
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
		
			it('should emit event on changed resource', function () {
				changed.calls.reset();
				$scope.resource = {
					getChangeables: function () {
						return ['key'];
					}
				};
				$scope.$digest();
				expect(changed).toHaveBeenCalled();
				expect(changed.calls.count()).toEqual(1);
				expect(changed.calls.mostRecent().args[1]).toBe($scope.resource);
			});
		
			it('should emit event on change in changeables', function () {
				changed.calls.reset();
				$scope.resource[$scope.resource.getChangeables()[0]] = 'value';
				$scope.$digest();
				expect(changed).toHaveBeenCalled();
				expect(changed.calls.count()).toEqual(1);
				expect(changed.calls.mostRecent().args[1]).toBe($scope.resource);
			});
			
		});
		
		describe('unwatching', function () {
			
			beforeEach(function () {
				$scope.$digest();
				changed.calls.reset();
				unwatch();
			});
			
			it('should not emit event on changed resource', function () {
				$scope.resource = {
					getChangeables: function () {
						return ['key'];
					}
				};
				$scope.$digest();
				expect(changed).not.toHaveBeenCalled();
			});
		
			it('should not emit event on change in changeables', function () {
				$scope.resource[$scope.resource.getChangeables()[0]] = 'value';
				$scope.$digest();
				expect(changed).not.toHaveBeenCalled();
			});
			
		});
		
		describe('watching', function () {
			
			var oldResource;
			var newResource;
			
			beforeEach(function () {
				oldResource = $scope.resource;
				newResource = {
					getChangeables: function () {
						return ['otherKey'];
					}
				};
				$scope.resource = newResource;
				$scope.$digest();
			});
			
			it('should unwatch old changeables', function () {
				expect(changed).toHaveBeenCalled();
				expect(changed.calls.count()).toEqual(1);
				expect(changed.calls.mostRecent().args[1]).not.toBe(oldResource);
				changed.calls.reset();
				oldResource[oldResource.getChangeables()[0]] = 'value';
				$scope.$digest();
				expect(changed).not.toHaveBeenCalled();
			});
			
			it('should watch new changeables', function () {
				expect(changed).toHaveBeenCalled();
				expect(changed.calls.count()).toEqual(1);
				expect(changed.calls.mostRecent().args[1]).toBe(newResource);
				changed.calls.reset();
				newResource[newResource.getChangeables()[0]] = 'value';
				$scope.$digest();
				expect(changed).toHaveBeenCalled();
				expect(changed.calls.count()).toEqual(1);
				expect(changed.calls.mostRecent().args[1]).toBe(newResource);
			});
			
			it('should watch changeables on undefined resource', function () {
				changed.calls.reset();
				$scope.resource = undefined;
				$scope.$digest();
				expect(changed).not.toHaveBeenCalled();
			});
		
		});
		
	});

});
