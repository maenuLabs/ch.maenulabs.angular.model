/* global ch, angular, i18n:true, describe, it, beforeEach, expect, jasmine, module, inject */
describe('AbstractResource', function () {

	var AbstractResource;
	var $httpBackend;
	var resource;
	
	beforeEach(module('ngMockE2E', 'ch.maenulabs.rest.angular.resource'));

	beforeEach(inject(['$httpBackend', 'ch.maenulabs.rest.angular.resource.AbstractResource', function (_$httpBackend_, _AbstractResource_) {
		AbstractResource = _AbstractResource_;
		$httpBackend = _$httpBackend_;
		resource = new AbstractResource();
		
	}]));

	describe('static', function () {

		it('should create statically with desimplify', function () {
			resource = AbstractResource.desimplify({
				uri: '/resource/1'
			});
			expect(resource instanceof AbstractResource).toBeTruthy();
			expect(resource.uri).toEqual('/resource/1');
		});

		it('should create statically with deserialize', function () {
			resource = AbstractResource.deserialize('{"uri":"/resource/1"}');
			expect(resource instanceof AbstractResource).toBeTruthy();
			expect(resource.uri).toEqual('/resource/1');
		});

	});

	it('should not implement getChangeables', function () {
		expect(function () {
			resource.getChangeables();
		}).toThrow(new Error('not implemented'));
	});

	it('should have a validation and a nulled uri', function () {
		expect(resource.uri).not.toBeDefined();
		expect(resource.validation).toBeDefined();
	});

	describe('URIs', function () {

		it('should not implement getBaseUri', function () {
			expect(function () {
				resource.getBaseUri();
			}).toThrow(new Error('not implemented'));
		});

		it('should not implement getSearchUri', function () {
			resource.getBaseUri = function () {
				return '/resource';
			};
			resource.simplify = function () {
				return {
					a: [1, 2, {
						b: 3
					}],
					c: {
						d: 'asdf'
					},
					e: null,
					f: 4
				};
			};
			expect(resource.getSearchUri()).toEqual('/resource?a.0=1&a.1=2&a.2.b=3&c.d=asdf&f=4');
		});

	});

	describe('simplification', function () {

		it('should implement simplify', function () {
			var uri = '/resource/1';
			resource.uri = uri;
			var simplification = resource.simplify();
			expect(simplification.uri).toEqual(uri);
		});

		it('should implement desimplify', function () {
			var simplification = {
				uri: '/resource/1'
			};
			resource.desimplify(simplification);
			expect(resource.uri).toEqual(simplification.uri);
		});

	});

	describe('constructor', function () {

		it('should use the intial values', function () {
			var values = {
				a: 1,
				b: 2
			};
			resource = new AbstractResource(values);
			expect(resource.a).toEqual(1);
			expect(resource.b).toEqual(2);
		});

		it('should override the intial values', function () {
			var values = {
				uri: '/resource/1',
				validation: 2
			};
			resource = new AbstractResource(values);
			expect(resource.uri).toEqual('/resource/1');
			expect(resource.validation).toEqual(2);
		});

	});

	describe('validation', function () {

		var ExistenceCheck;
		
		beforeEach(function () {
			ExistenceCheck = ch.maenulabs.validation.ExistenceCheck;
		});

		it('should have no errors', function () {
			expect(resource.hasErrors()).toBeFalsy();
			expect(resource.getErrors()).toEqual({});
			expect(resource.hasError('a')).toBeFalsy();
			expect(resource.getError('a')).toEqual([]);
		});

		it('should have errors', function () {
			var message = 'message';
			i18n = {
				'ch/maenulabs/validation/ExistenceCheck': {
					message: function () {
						return message;
					}
				}
			};
			resource = new AbstractResource({
				a: null,
				b: 1
			});
			resource.validation.add(new ExistenceCheck('a'));
			expect(resource.hasErrors()).toBeTruthy();
			expect(resource.getErrors()).toEqual({
				a: [message]
			});
			expect(resource.hasError('a')).toBeTruthy();
			expect(resource.getError('a')).toEqual([message]);
			expect(resource.hasError('b')).toBeFalsy();
			expect(resource.getError('b')).toEqual([]);
		});

	});

	describe('serialization', function () {

		var simplification;

		beforeEach(function () {
			simplification = {
				a: 1
			};
		});

		it('should serialize the simplification from serialize', function () {
			resource.simplify = jasmine.createSpy().and.returnValue(simplification);
			var serialization = resource.serialize();
			expect(resource.simplify).toHaveBeenCalled();
			expect(serialization).toEqual(angular.toJson(simplification));
		});

		it('should deserialize the simplification from deserialize', function () {
			resource.desimplify = jasmine.createSpy();
			resource.deserialize(angular.toJson(simplification));
			expect(resource.desimplify).toHaveBeenCalledWith(simplification);
		});

	});

	describe('crud', function () {
		
		var success;
		var error;
		var baseUri;
		var simplification;

		beforeEach(function () {
			success = jasmine.createSpy();
			error = jasmine.createSpy();
			baseUri = '/resource';
			simplification = {
				uri: '/resource/1',
				message: 'hello'
			};
			resource.getBaseUri = jasmine.createSpy().and.returnValue(baseUri);
			resource.desimplify = function (simplification) {
				this.uri = simplification.uri;
				this.message = simplification.message;
			};
			resource.simplify = function () {
				return {
					uri: this.uri,
					message: this.message
				};
			};
		});

		describe('create', function () {

			beforeEach(function () {
				resource.message = simplification.message;
			});

			it('should create with success', function () {
				$httpBackend.expect('POST', baseUri).respond(201, '', {
					'location': '/resource/1'
				});
				resource.create().then(success).catch(error);
				$httpBackend.flush();
				expect(success).toHaveBeenCalled();
				expect(error).not.toHaveBeenCalled();
				expect(resource.uri).toEqual(simplification.uri);
				expect(resource.message).toEqual(simplification.message);
			});

			it('should create with error', function () {
				$httpBackend.expect('POST', baseUri).respond(403, '');
				resource.create().then(success).catch(error);
				$httpBackend.flush();
				expect(success).not.toHaveBeenCalled();
				expect(error).toHaveBeenCalled();
				expect(resource.uri).not.toBeDefined();
				expect(resource.message).toEqual(simplification.message);
			});

		});

		describe('read', function () {

			beforeEach(function () {
				resource.uri = simplification.uri;
			});

			it('should read with success', function () {
				$httpBackend.expect('GET', resource.uri).respond(200, {
					uri: simplification.uri,
					message: simplification.message
				});
				resource.read().then(success).catch(error);
				$httpBackend.flush();
				expect(success).toHaveBeenCalled();
				expect(error).not.toHaveBeenCalled();
				expect(resource.uri).toEqual(simplification.uri);
				expect(resource.message).toEqual(simplification.message);
			});

			it('should read with error', function () {
				$httpBackend.expect('GET', resource.uri).respond(404, '');
				resource.read().then(success).catch(error);
				$httpBackend.flush();
				expect(success).not.toHaveBeenCalled();
				expect(error).toHaveBeenCalled();
				expect(resource.uri).toEqual(simplification.uri);
				expect(resource.message).not.toBeDefined();
			});

		});

		describe('update', function () {

			var message;

			beforeEach(function () {
				message = 'hello hello';
				resource.uri = simplification.uri;
				resource.message = message;
			});

			it('should update with success', function () {
				$httpBackend.expect('PUT', resource.uri).respond(202, '');
				resource.update().then(success).catch(error);
				$httpBackend.flush();
				expect(success).toHaveBeenCalled();
				expect(error).not.toHaveBeenCalled();
				expect(resource.uri).toEqual(simplification.uri);
				expect(resource.message).toEqual(message);
			});

			it('should update with error', function () {
				$httpBackend.expect('PUT', simplification.uri).respond(403, '');
				resource.update().then(success).catch(error);
				$httpBackend.flush();
				expect(success).not.toHaveBeenCalled();
				expect(error).toHaveBeenCalled();
				expect(resource.uri).toEqual(simplification.uri);
				expect(resource.message).toEqual(message);
			});

		});

		describe('delete', function () {

			beforeEach(function () {
				resource.uri = simplification.uri;
			});

			it('should delete with success', function () {
				$httpBackend.expect('DELETE', resource.uri).respond(202, '');
				resource.delete().then(success).catch(error);
				$httpBackend.flush();
				expect(success).toHaveBeenCalled();
				expect(error).not.toHaveBeenCalled();
				expect(resource.uri).toBeNull();
			});

			it('should delete with error', function () {
				$httpBackend.expect('DELETE', resource.uri).respond(404, '');
				resource.delete().then(success).catch(error);
				$httpBackend.flush();
				expect(success).not.toHaveBeenCalled();
				expect(error).toHaveBeenCalled();
				expect(resource.uri).toEqual(simplification.uri);
				expect(resource.message).not.toBeDefined();
			});

		});

		describe('search', function () {
			
			var searchUri;

			beforeEach(function () {
				searchUri = '/resource?message=hello';
				resource.getSearchUri = jasmine.createSpy().and.returnValue(searchUri);
				AbstractResource.prototype.desimplify = function (simplification) {
					this.uri = simplification.uri;
				};
			});

			it('should search with success', function () {
				$httpBackend.expect('GET', searchUri).respond(200, [{
					uri: '/resource/1'
				}]);
				resource.search().then(success).catch(error);
				$httpBackend.flush();
				expect(success).toHaveBeenCalled();
				expect(error).not.toHaveBeenCalled();
				var results = success.calls.mostRecent().args[0].results;
				expect(results.length).toEqual(1);
				expect(results[0] instanceof AbstractResource).toBeTruthy();
				expect(results[0].uri).toEqual('/resource/1');
			});

			it('should search with error', function () {
				$httpBackend.expect('GET', searchUri).respond(403, '');
				resource.search().then(success).catch(error);
				$httpBackend.flush();
				expect(success).not.toHaveBeenCalled();
				expect(error).toHaveBeenCalled();
			});

		});

	});

});
