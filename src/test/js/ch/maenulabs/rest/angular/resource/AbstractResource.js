/* global ch, angular, i18n:true, describe, it, beforeEach, expect, jasmine */
describe('AbstractResource', function () {

	var $injector = angular.injector(['ng', 'ngMockE2E', 'ch.maenulabs.rest.angular.resource']);
	var AbstractResource = $injector.get('ch.maenulabs.rest.angular.resource.AbstractResource');
	var $httpBackend = $injector.get('$httpBackend');

	var resource = null;

	beforeEach(function () {
		resource = new AbstractResource();
	});

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

	it('should have a validation and a nulled uri', function () {
		expect(resource.uri).not.toBeDefined();
		expect(resource.validation).toBeDefined();
	});

	describe('URIs', function () {

		it('should not implement getBaseUri', function () {
			expect(function () {
				resource.getBaseUri();
			}).toThrow('not implemented');
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

		var ExistenceCheck = ch.maenulabs.validation.ExistenceCheck;

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

		var simplification = null;

		beforeEach(function () {
			simplification = {
				a: 1
			};
		});

		it('should serialize the simplification from serialize', function () {
			resource.simplify = jasmine.createSpy().andReturn(simplification);
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

		var baseUri = null;
		var simplification = null;
		var success = null;
		var error = null;

		beforeEach(function () {
			baseUri = 'resource';
			simplification = {
				uri: '/resource/1',
				message: 'hello'
			};
			resource.getBaseUri = jasmine.createSpy().andReturn(baseUri);
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
			success = jasmine.createSpy();
			error = jasmine.createSpy();
		});

		describe('create', function () {

			beforeEach(function () {
				resource.message = simplification.message;
			});

			it('should create without callbacks', function () {
				$httpBackend.expect('POST', baseUri).respond(201, '', {
					'location': '/resource/1'
				});
				expect(resource.create()).toBe(resource);
				$httpBackend.flush();
				expect(resource.uri).toEqual(simplification.uri);
				expect(resource.message).toEqual(simplification.message);
			});

			it('should create with success', function () {
				$httpBackend.expect('POST', baseUri).respond(201, '', {
					'location': '/resource/1'
				});
				expect(resource.create(success, error)).toBe(resource);
				expect(success).not.toHaveBeenCalled();
				expect(error).not.toHaveBeenCalled();
				$httpBackend.flush();
				expect(success).toHaveBeenCalled();
				expect(error).not.toHaveBeenCalled();
				expect(resource.uri).toEqual(simplification.uri);
				expect(resource.message).toEqual(simplification.message);
			});

			it('should create with error', function () {
				$httpBackend.expect('POST', baseUri).respond(403, '');
				expect(resource.create(success, error)).toBe(resource);
				expect(success).not.toHaveBeenCalled();
				expect(error).not.toHaveBeenCalled();
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

			it('should read without callbacks', function () {
				$httpBackend.expect('GET', resource.uri).respond(200, {
					uri: simplification.uri,
					message: simplification.message
				});
				expect(resource.read()).toBe(resource);
				$httpBackend.flush();
				expect(resource.uri).toEqual(simplification.uri);
				expect(resource.message).toEqual(simplification.message);
			});

			it('should read with success', function () {
				$httpBackend.expect('GET', resource.uri).respond(200, {
					uri: simplification.uri,
					message: simplification.message
				});
				expect(resource.read(success, error)).toBe(resource);
				expect(success).not.toHaveBeenCalled();
				expect(error).not.toHaveBeenCalled();
				$httpBackend.flush();
				expect(success).toHaveBeenCalled();
				expect(error).not.toHaveBeenCalled();
				expect(resource.uri).toEqual(simplification.uri);
				expect(resource.message).toEqual(simplification.message);
			});

			it('should read with error', function () {
				$httpBackend.expect('GET', resource.uri).respond(404, '');
				expect(resource.read(success, error)).toBe(resource);
				expect(success).not.toHaveBeenCalled();
				expect(error).not.toHaveBeenCalled();
				$httpBackend.flush();
				expect(success).not.toHaveBeenCalled();
				expect(error).toHaveBeenCalled();
				expect(resource.uri).toEqual(simplification.uri);
				expect(resource.message).not.toBeDefined();
			});

		});

		describe('update', function () {

			var message = 'hello hello';

			beforeEach(function () {
				resource.uri = simplification.uri;
				resource.message = message;
			});

			it('should update without callbacks', function () {
				$httpBackend.expect('PUT', resource.uri).respond(202, '');
				expect(resource.update()).toBe(resource);
				$httpBackend.flush();
				expect(resource.uri).toEqual(simplification.uri);
				expect(resource.message).toEqual(message);
			});

			it('should update with success', function () {
				$httpBackend.expect('PUT', resource.uri).respond(202, '');
				expect(resource.update(success, error)).toBe(resource);
				expect(success).not.toHaveBeenCalled();
				expect(error).not.toHaveBeenCalled();
				$httpBackend.flush();
				expect(success).toHaveBeenCalled();
				expect(error).not.toHaveBeenCalled();
				expect(resource.uri).toEqual(simplification.uri);
				expect(resource.message).toEqual(message);
			});

			it('should update with error', function () {
				$httpBackend.expect('PUT', simplification.uri).respond(403, '');
				expect(resource.update(success, error)).toBe(resource);
				expect(success).not.toHaveBeenCalled();
				expect(error).not.toHaveBeenCalled();
				$httpBackend.flush();
				expect(success).not.toHaveBeenCalled();
				expect(error).toHaveBeenCalled();
				expect(resource.uri).toEqual(simplification.uri);
				expect(resource.message).toEqual(message);
			});

		});

		describe('remove', function () {

			beforeEach(function () {
				resource.uri = simplification.uri;
			});

			it('should remove without callbacks', function () {
				$httpBackend.expect('DELETE', resource.uri).respond(202, '');
				expect(resource.remove()).toBe(resource);
				$httpBackend.flush();
				expect(resource.uri).toBeNull();
			});

			it('should remove with success', function () {
				$httpBackend.expect('DELETE', resource.uri).respond(202, '');
				expect(resource.remove(success, error)).toBe(resource);
				expect(success).not.toHaveBeenCalled();
				expect(error).not.toHaveBeenCalled();
				$httpBackend.flush();
				expect(success).toHaveBeenCalled();
				expect(error).not.toHaveBeenCalled();
				expect(resource.uri).toBeNull();
			});

			it('should remove with error', function () {
				$httpBackend.expect('DELETE', resource.uri).respond(404, '');
				expect(resource.remove(success, error)).toBe(resource);
				expect(success).not.toHaveBeenCalled();
				expect(error).not.toHaveBeenCalled();
				$httpBackend.flush();
				expect(success).not.toHaveBeenCalled();
				expect(error).toHaveBeenCalled();
				expect(resource.uri).toEqual(simplification.uri);
				expect(resource.message).not.toBeDefined();
			});

		});

		describe('search', function () {

			beforeEach(function () {
				resource.getBaseUri = function () {
					return '/resource';
				};
				AbstractResource.prototype.desimplify = function (simplification) {
					this.uri = simplification.uri;
				};
			});

			it('should search without callbacks', function () {
				$httpBackend.expect('GET', resource.getBaseUri()).respond(200, [{
					uri: '/resource/1'
				}]);
				var results = resource.search();
				expect(results).toEqual([]);
				$httpBackend.flush();
				expect(results.length).toEqual(1);
				expect(results[0] instanceof AbstractResource).toBeTruthy();
				expect(results[0].uri).toEqual('/resource/1');
			});

			it('should search with success', function () {
				$httpBackend.expect('GET', resource.getBaseUri()).respond(200, [{
					uri: '/resource/1'
				}]);
				var results = resource.search(success, error);
				expect(results).toEqual([]);
				expect(success).not.toHaveBeenCalled();
				expect(error).not.toHaveBeenCalled();
				$httpBackend.flush();
				expect(results.length).toEqual(1);
				expect(results[0] instanceof AbstractResource).toBeTruthy();
				expect(results[0].uri).toEqual('/resource/1');
				expect(success).toHaveBeenCalled();
				expect(error).not.toHaveBeenCalled();
			});

			it('should search with error', function () {
				$httpBackend.expect('GET', resource.getBaseUri()).respond(403, '');
				var results = resource.search(success, error);
				expect(results).toEqual([]);
				expect(success).not.toHaveBeenCalled();
				expect(error).not.toHaveBeenCalled();
				$httpBackend.flush();
				expect(results).toEqual([]);
				expect(success).not.toHaveBeenCalled();
				expect(error).toHaveBeenCalled();
			});

		});

	});

});
