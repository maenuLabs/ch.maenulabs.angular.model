/* global describe, it, beforeEach, expect, jasmine, module, inject */
describe('eventifySchedule', function () {

	var $timeout;
	var $scope;
	var delay;
	var eventifySchedule;
	var eventifyedSchedule;
	
	beforeEach(module('ch.maenulabs.rest.angular.event'));

	beforeEach(inject(['$timeout', '$rootScope', 'ch.maenulabs.rest.angular.event.eventifySchedule', function (_$timeout_, _$rootScope_, _eventifySchedule_) {
		$timeout = _$timeout_;
		$scope = _$rootScope_.$new();
		delay = 1000;
		eventifySchedule = _eventifySchedule_;
	}]));
	
	describe('events', function () {
		
		var scheduled;
		var cancelled;
		var done;
		
		beforeEach(function () {
			scheduled = jasmine.createSpy();
			cancelled = jasmine.createSpy();
			done = jasmine.createSpy();
			$scope.$on('ch.maenulabs.rest.angular.event.schedule.Scheduled', scheduled);
			$scope.$on('ch.maenulabs.rest.angular.event.schedule.Cancelled', cancelled);
			$scope.$on('ch.maenulabs.rest.angular.event.schedule.Done', done);
			eventifyedSchedule = eventifySchedule($scope, delay);
			$scope.$digest();
		});
		
		it('should emit event on scheduled', function () {
			expect(scheduled).toHaveBeenCalled();
			expect(scheduled.calls.mostRecent().args[1]).toBe(eventifyedSchedule);
			expect(cancelled).not.toHaveBeenCalled();
			expect(done).not.toHaveBeenCalled();
		});
		
		it('should emit event on cancelled', function () {
			eventifyedSchedule();
			scheduled.calls.reset();
			$scope.$digest();
			expect(scheduled).not.toHaveBeenCalled();
			expect(cancelled).toHaveBeenCalled();
			expect(cancelled.calls.mostRecent().args[1]).toBe(eventifyedSchedule);
			expect(done).not.toHaveBeenCalled();
		});
		
		it('should emit event on done', function () {
			scheduled.calls.reset();
			$timeout.flush();
			expect(scheduled).not.toHaveBeenCalled();
			expect(cancelled).not.toHaveBeenCalled();
			expect(done).toHaveBeenCalled();
			expect(done.calls.mostRecent().args[1]).toBe(eventifyedSchedule);
		});
		
	});

});
