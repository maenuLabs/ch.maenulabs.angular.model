describe('ReadFactory', function () {

	var $scope;
	var resource;
	var Read;
	
	beforeEach(module('ng', 'ch.maenulabs.rest.angular.controller'));

	beforeEach(inject(['$controller', '$rootScope', 'ch.maenulabs.rest.angular.controller.ReadFactory', function (_$controller_, _$rootScope_, _ReadFactory_) {
		resource = {};
		$scope = _$rootScope_.$new();
		Read = _$controller_(_ReadFactory_, {
			'$scope': $scope,
			'resource': resource
		});
	}]));

	it('should set the resource on the scope', function () {
		expect($scope.resource).toBe(resource);
	});

});
