/* global ch, fail, describe, it, beforeEach, afterEach, expect, module, inject */
describe('router', function () {
	
	var routerProvider;
	var element;
	var $httpBackend;
	var $location;
	var $rootScope;
	var $route;
	var router;
	var Test;
	
	beforeEach(module('ch.maenulabs.rest.angular.router', ['ch.maenulabs.rest.angular.router.routerProvider', '$provide', function(_routerProvider_, _$provide_) {
		routerProvider = _routerProvider_;
		routerProvider.addRoute('test', 'read', 'Test', {});
		routerProvider.addRoute('test', 'create', 'Test', {
			resolve: {
				uri: function () {
					return '/api/test/1';
				}
			}
		});
		_$provide_.factory('Test', ['ch.maenulabs.rest.angular.Resource', function (Resource) {
			return new ch.maenulabs.type.Type(Resource, {
				simplify: function () {
					var simplification = this.base('simplify')();
					if (this.uri) {
						simplification.uri = this.uri;
					}
					return simplification;
				},
				desimplify: function (simplification) {
					this.base('desimplify')(simplification);
					if (simplification.uri) {
						this.uri = simplification.uri;
					}
				}
			});
		}]);
    }]));

	beforeEach(inject(['$httpBackend', '$location', '$rootScope', '$compile', '$route', 'ch.maenulabs.rest.angular.router.router', 'Test', function (_$httpBackend_, _$location_, _$rootScope_, _$compile_, _$route_, _router_, _Test_) {
		$httpBackend = _$httpBackend_;
		$location = _$location_;
		$rootScope = _$rootScope_;
		$route = _$route_;
		router = _router_;
		Test = _Test_;
		// NOTE ngRoute needs ngView
		element = _$compile_('<div><div ng-view></div></div>')($rootScope);
	}]));
	
	afterEach(function () {
		element.remove();
	});
	
	it('should get the URI without any properties', function () {
		var resource = new Test();
		expect(router.getUri('test', 'read', resource)).toEqual('/test/read/{}');
	});
	
	it('should get the URI with properties', function () {
		var resource = new Test({
			uri: '/api/test/1'
		});
		expect(router.getUri('test', 'read', resource)).toEqual('/test/read/{"uri":"/api/test/1"}');
	});

	it('should deserialize the resource from an URI with serialization', function () {
		var changed = false;
		$rootScope.$on('$routeChangeStart', function () {
			changed = true;
		});
		$rootScope.$on('$routeChangeSuccess', function ($event, current) {
			expect(current.locals.resource).toBeDefined();
			expect(current.locals.resource.uri).toEqual('/api/test/1');
		});
		$rootScope.$on('$routeChangeError', function () {
			fail();
		});
		$location.path('/test/read/{"uri":"/api/test/1"}');
		$rootScope.$digest();
		expect(changed).toBeTruthy();
	});

	it('should instantiate the resource from an URI without serialization', function () {
		var changed = false;
		$rootScope.$on('$routeChangeStart', function () {
			changed = true;
		});
		$rootScope.$on('$routeChangeSuccess', function ($event, current) {
			expect(current.locals.resource).toBeDefined();
			expect(current.locals.resource.uri).not.toBeDefined();
		});
		$rootScope.$on('$routeChangeError', function () {
			fail();
		});
		$location.path('/test/read');
		$rootScope.$digest();
		expect(changed).toBeTruthy();
	});

	it('should not override resolve', function () {
		var changed = false;
		$rootScope.$on('$routeChangeStart', function () {
			changed = true;
		});
		$rootScope.$on('$routeChangeSuccess', function ($event, current) {
			expect(current.locals.resource).toBeDefined();
			expect(current.locals.uri).toEqual('/api/test/1');
		});
		$rootScope.$on('$routeChangeError', function () {
			fail();
		});
		$location.path('/test/create/{}');
		$rootScope.$digest();
		expect(changed).toBeTruthy();
	});

});
