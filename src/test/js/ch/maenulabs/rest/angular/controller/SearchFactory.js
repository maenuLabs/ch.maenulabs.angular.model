describe('SearchFactory', function () {

	var $scope;
	var $timeout;
	var $q;
	var changeables;
	var resource;
	var Search;
	
	beforeEach(module('ng', 'ngMock', 'ch.maenulabs.rest.angular.controller'));

	beforeEach(inject(['$controller', '$rootScope', '$timeout', '$q', 'ch.maenulabs.rest.angular.controller.SearchFactory', function (_$controller_, _$rootScope_, _$timeout_, _$q_, _SearchFactory_) {
		changeables = ['key'];
		resource = {
			getChangeables: jasmine.createSpy().and.returnValue(changeables)
		};
		$scope = _$rootScope_.$new();
		$timeout = _$timeout_;
		$q = _$q_;
		Search = _$controller_(_SearchFactory_, {
			'$scope': $scope,
			'resource': resource
		});
	}]));

	it('should set the resource on the scope', function () {
		expect($scope.resource).toBe(resource);
	});
	
	describe('search', function () {
		
		var deffered;
		
		beforeEach(function () {
			deferred = $q.defer();
			resource.search = jasmine.createSpy().and.returnValue(deferred.promise);
		});
		
		it('should search on change', function () {
			var listener = jasmine.createSpy();
			$scope.$on('ch.maenulabs.rest.angular.controller.search.Pending', listener);
			$scope.$apply();
			expect(listener.calls.mostRecent().args[1]).toBe($scope.currentSearchEvent);
			expect(listener.calls.mostRecent().args[2]).toBe(resource);
		});
		
		it('should call resource\'s search and register listeners', function () {
			var listener = jasmine.createSpy();
			$scope.$on('ch.maenulabs.rest.angular.controller.search.Pending', listener);
			$scope.search();
			$timeout.flush();
			expect(resource.search).toHaveBeenCalled();
			expect(listener.calls.mostRecent().args[1]).toBe($scope.currentSearchEvent);
			expect(listener.calls.mostRecent().args[2]).toBe(resource);
		});
		
		it('should emit event on success', function () {
			var listener = jasmine.createSpy();
			$scope.$on('ch.maenulabs.rest.angular.controller.search.Success', listener);
			$scope.search();
			$timeout.flush();
			var response = {};
			deferred.resolve(response);
			$scope.$apply();
			expect(listener.calls.mostRecent().args[1]).toBe($scope.currentSearchEvent);
			expect(listener.calls.mostRecent().args[2]).toBe(resource);
			expect(listener.calls.mostRecent().args[3]).toBe(response);
		});
		
		it('should emit event on error', function () {
			var listener = jasmine.createSpy();
			$scope.$on('ch.maenulabs.rest.angular.controller.search.Error', listener);
			$scope.search();
			$timeout.flush();
			var response = {};
			deferred.reject(response);
			$scope.$apply();
			expect(listener.calls.mostRecent().args[1]).toBe($scope.currentSearchEvent);
			expect(listener.calls.mostRecent().args[2]).toBe(resource);
			expect(listener.calls.mostRecent().args[3]).toBe(response);
		});
		
		it('should emit event on cancel', function () {
			var listener = jasmine.createSpy();
			$scope.$on('ch.maenulabs.rest.angular.controller.search.Error', listener);
			$scope.search();
			currentSearchEvent = $scope.currentSearchEvent;
			currentSearchEvent.cancel();
			$scope.$apply();
			expect(listener.calls.mostRecent().args[1]).toBe(currentSearchEvent);
			expect(listener.calls.mostRecent().args[2]).toBe(resource);
		});
		
	});

});
