/* global fail, describe, it, beforeEach, afterEach, expect, module, inject */
describe('router', function () {

	var routerProvider;
	var element;
	var $httpBackend;
	var $location;
	var $rootScope;
	var $route;
	var router;
	var Resource;

	beforeEach(module('ch.maenulabs.rest.angular.router', ['ch.maenulabs.rest.angular.router.routerProvider', function (_routerProvider_) {
		routerProvider = _routerProvider_;
		routerProvider.addRoute('resource', 'read', 'ch.maenulabs.rest.angular.resource.Resource', {});
		routerProvider.addRoute('resource', 'create', 'ch.maenulabs.rest.angular.resource.Resource', {
			resolve: {
				a: function () {
					return 1;
				}
			}
		});
	}]));

	beforeEach(inject(['$httpBackend', '$location', '$rootScope', '$compile', '$route', 'ch.maenulabs.rest.angular.router.router', 'ch.maenulabs.rest.angular.resource.Resource', function (_$httpBackend_, _$location_, _$rootScope_, _$compile_, _$route_, _router_, _Resource_) {
		$httpBackend = _$httpBackend_;
		$location = _$location_;
		$rootScope = _$rootScope_;
		$route = _$route_;
		router = _router_;
		Resource = _Resource_;
		// NOTE ngRoute needs ngView
		element = _$compile_('<div><div ng-view></div></div>')($rootScope);
	}]));

	afterEach(function () {
		element.remove();
	});

	it('should get the URI without any properties', function () {
		var resource = new Resource();
		expect(router.getUri('resource', 'read', resource)).toEqual('/resource/read/{}');
	});

	it('should get the URI with properties', function () {
		var resource = new Resource({
			'@self': '/api/resource/1'
		});
		expect(router.getUri('resource', 'read', resource)).toEqual('/resource/read/{"@self":"/api/resource/1"}');
	});

	it('should deserialize the resource from an URI with serialization', function () {
		var changed = false;
		$rootScope.$on('$routeChangeStart', function () {
			changed = true;
		});
		$rootScope.$on('$routeChangeSuccess', function ($event, current) {
			expect(current.locals.resource).toBeDefined();
			expect(current.locals.resource['@self']).toEqual('/api/resource/1');
		});
		$rootScope.$on('$routeChangeError', function () {
			fail();
		});
		$location.path('/resource/read/{"@self":"/api/resource/1"}');
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
			expect(current.locals.resource['@self']).not.toBeDefined();
		});
		$rootScope.$on('$routeChangeError', function () {
			fail();
		});
		$location.path('/resource/read');
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
			expect(current.locals.a).toEqual(1);
		});
		$rootScope.$on('$routeChangeError', function () {
			fail();
		});
		$location.path('/resource/create/{}');
		$rootScope.$digest();
		expect(changed).toBeTruthy();
	});

});
