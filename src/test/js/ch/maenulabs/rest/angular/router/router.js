/* global describe, it, beforeEach, expect, jasmine, module, inject */
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
		routerProvider.addRoute('test', 'Test', 'read', {});
		routerProvider.addRoute('test', 'Test', 'create', {
			resolve: {
				thing: function () {
					return "thang";
				}
			}
		});
		_$provide_.factory('Test', ['ch.maenulabs.rest.angular.resource.AbstractResource', function (AbstractResource) {
			return new ch.maenulabs.type.Type(AbstractResource, {
				getBaseUri: function () {
					return '/test';
				},
				getBaseName: function () {
					return 'test';
				},
				simplify: function () {
					var simplification = this.base('simplify')();
					if (this.thing) {
						simplification.thing = this.thing;
					}
					return simplification;
				},
				desimplify: function (simplification) {
					this.base('desimplify')(simplification);
					if (simplification.thing) {
						this.thing = simplification.thing;
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
		expect(router.getUri(resource, 'read')).toEqual('/test/read/{}');
	});
	
	it('should get the URI with properties', function () {
		var resource = new Test({
			thing: "thang"
		});
		expect(router.getUri(resource, 'read')).toEqual('/test/read/{"thing":"thang"}');
	});

	it('should not read without URI', function () {
		var changed = false;
		$rootScope.$on('$routeChangeStart', function () {
			changed = true;
		});
		$rootScope.$on('$routeChangeSuccess', function ($event, current) {
			expect(current.locals.resource).toBeDefined();
			expect(current.locals.resource.thing).toEqual("thang");
		});
		$rootScope.$on('$routeChangeError', function () {
			fail();
		});
		$location.path('/test/read/{"thing":"thang"}');
		$rootScope.$digest();
		expect(changed).toBeTruthy();
	});

	it('should read with URI', function () {
		var changed = false;
		$rootScope.$on('$routeChangeStart', function () {
			changed = true;
		});
		$rootScope.$on('$routeChangeSuccess', function ($event, current) {
			expect(current.locals.resource).toBeDefined();
			expect(current.locals.resource.thing).toEqual("thang");
		});
		$rootScope.$on('$routeChangeError', function () {
			fail();
		});
		var uri = '/test/1';
		$httpBackend.expect('GET', uri).respond(200, {
			thing: "thang"
		});
		$location.path('/test/read/{"uri":"' + uri + '"}');
		$rootScope.$digest();
		$httpBackend.flush();
		expect(changed).toBeTruthy();
	});

	it('should not override resolve', function () {
		var changed = false;
		$rootScope.$on('$routeChangeStart', function () {
			changed = true;
		});
		$rootScope.$on('$routeChangeSuccess', function ($event, current) {
			expect(current.locals.resource).toBeDefined();
			expect(current.locals.thing).toEqual("thang");
		});
		$rootScope.$on('$routeChangeError', function () {
			fail();
		});
		$location.path('/test/create/{}');
		$rootScope.$digest();
		expect(changed).toBeTruthy();
	});

});
