/* global ch, angular, i18n:true, describe, it, beforeEach, expect, jasmine */
describe('AbstractResource', function () {

	var $injector = angular.injector(['ng', 'ngMockE2E', 'ch.maenulabs.rest.angular']);
	var AbstractResource = $injector.get('ch.maenulabs.rest.angular.resource.AbstractResource');
	var ExistenceCheck = ch.maenulabs.validation.ExistenceCheck;
	var $httpBackend = $injector.get('$httpBackend');

	var resource = null;

	beforeEach(function () {
		resource = new AbstractResource();
	});

	describe('static', function () {

		it('should create statically with fromSerializable', function () {
			resource = AbstractResource.fromSerializable({
				uri: 1
			});
			expect(resource instanceof AbstractResource).toBeTruthy();
			expect(resource.uri).toEqual(1);
		});

		it('should create statically with fromJson', function () {
			resource = AbstractResource.fromJson('{"uri":1}');
			expect(resource instanceof AbstractResource).toBeTruthy();
			expect(resource.uri).toEqual(1);
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

	describe('serializable', function () {

		it('should implement toSerializable', function () {
			var uri = 1;
			resource.uri = uri;
			var serializable = resource.toSerializable();
			expect(serializable.uri).toEqual(uri);
		});

		it('should implement fromSerializable', function () {
			var serializable = {
				uri: 1
			};
			resource.fromSerializable(serializable);
			expect(resource.uri).toEqual(serializable.uri);
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
				uri: 1,
				validation: 2
			};
			resource = new AbstractResource(values);
			expect(resource.uri).toEqual(1);
			expect(resource.validation).toEqual(2);
		});

	});

	describe('validation', function () {

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

	describe('json', function () {

		var serializable = null;

		beforeEach(function () {
			serializable = {
				a: 1
			};
		});

		it('should serialize the serializable from toJson', function () {
			resource.toSerializable = jasmine.createSpy().andReturn(serializable);
			var json = resource.toJson();
			expect(resource.toSerializable).toHaveBeenCalled();
			expect(json).toEqual(angular.toJson(serializable));
		});

		it('should deserialize the serializable from fromJson', function () {
			resource.fromSerializable = jasmine.createSpy();
			resource.fromJson(angular.toJson(serializable));
			expect(resource.fromSerializable).toHaveBeenCalledWith(serializable);
		});

	});

	describe('crud', function () {

		var baseUri = null;
		var serializable = null;
		var success = null;
		var error = null;

		beforeEach(function () {
			baseUri = 'resource';
			serializable = {
				uri: 1,
				message: 'hello'
			};
			resource.getBaseUri = jasmine.createSpy().andReturn(baseUri);
			resource.fromSerializable = function (serializable) {
				this.uri = serializable.uri;
				this.message = serializable.message;
			};
			resource.toSerializable = function () {
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
				resource.message = serializable.message;
			});

			it('should create without callbacks', function () {
				$httpBackend.expect('POST', baseUri).respond({
					uri: serializable.uri,
					message: serializable.message
				});
				expect(resource.create()).toBe(resource);
				$httpBackend.flush();
				expect(resource.uri).toEqual(serializable.uri);
				expect(resource.message).toEqual(serializable.message);
			});

			it('should create with success', function () {
				$httpBackend.expect('POST', baseUri).respond({
					uri: serializable.uri,
					message: serializable.message
				});
				expect(resource.create(success, error)).toBe(resource);
				expect(success).not.toHaveBeenCalled();
				expect(error).not.toHaveBeenCalled();
				$httpBackend.flush();
				expect(success).toHaveBeenCalled();
				expect(error).not.toHaveBeenCalled();
				expect(resource.uri).toEqual(serializable.uri);
				expect(resource.message).toEqual(serializable.message);
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
				expect(resource.message).toEqual(serializable.message);
			});

		});

		describe('read', function () {

			beforeEach(function () {
				resource.uri = serializable.uri;
			});

			it('should read without callbacks', function () {
				$httpBackend.expect('GET', resource.uri).respond({
					uri: serializable.uri,
					message: serializable.message
				});
				expect(resource.read()).toBe(resource);
				$httpBackend.flush();
				expect(resource.uri).toEqual(serializable.uri);
				expect(resource.message).toEqual(serializable.message);
			});

			it('should read with success', function () {
				$httpBackend.expect('GET', resource.uri).respond({
					uri: serializable.uri,
					message: serializable.message
				});
				expect(resource.read(success, error)).toBe(resource);
				expect(success).not.toHaveBeenCalled();
				expect(error).not.toHaveBeenCalled();
				$httpBackend.flush();
				expect(success).toHaveBeenCalled();
				expect(error).not.toHaveBeenCalled();
				expect(resource.uri).toEqual(serializable.uri);
				expect(resource.message).toEqual(serializable.message);
			});

			it('should read with error', function () {
				$httpBackend.expect('GET', resource.uri).respond(404, '');
				expect(resource.read(success, error)).toBe(resource);
				expect(success).not.toHaveBeenCalled();
				expect(error).not.toHaveBeenCalled();
				$httpBackend.flush();
				expect(success).not.toHaveBeenCalled();
				expect(error).toHaveBeenCalled();
				expect(resource.uri).toEqual(serializable.uri);
				expect(resource.message).not.toBeDefined();
			});

		});

		describe('update', function () {

			var message = 'hello hello';

			beforeEach(function () {
				resource.uri = serializable.uri;
				resource.message = message;
			});

			it('should update without callbacks', function () {
				$httpBackend.expect('PUT', resource.uri).respond({
					uri: serializable.uri,
					message: serializable.message
				});
				expect(resource.update()).toBe(resource);
				$httpBackend.flush();
				expect(resource.uri).toEqual(serializable.uri);
				expect(resource.message).toEqual(message);
			});

			it('should update with success', function () {
				$httpBackend.expect('PUT', resource.uri).respond({
					uri: resource.uri,
					message: resource.message
				});
				expect(resource.update(success, error)).toBe(resource);
				expect(success).not.toHaveBeenCalled();
				expect(error).not.toHaveBeenCalled();
				$httpBackend.flush();
				expect(success).toHaveBeenCalled();
				expect(error).not.toHaveBeenCalled();
				expect(resource.uri).toEqual(serializable.uri);
				expect(resource.message).toEqual(message);
			});

			it('should update with error', function () {
				$httpBackend.expect('PUT', serializable.uri).respond(403, '');
				expect(resource.update(success, error)).toBe(resource);
				expect(success).not.toHaveBeenCalled();
				expect(error).not.toHaveBeenCalled();
				$httpBackend.flush();
				expect(success).not.toHaveBeenCalled();
				expect(error).toHaveBeenCalled();
				expect(resource.uri).toEqual(serializable.uri);
				expect(resource.message).toEqual(message);
			});

		});

		describe('remove', function () {

			beforeEach(function () {
				resource.uri = serializable.uri;
			});

			it('should remove without callbacks', function () {
				$httpBackend.expect('DELETE', resource.uri).respond(200, '');
				expect(resource.remove()).toBe(resource);
				$httpBackend.flush();
				expect(resource.uri).toBeNull();
			});

			it('should remove with success', function () {
				$httpBackend.expect('DELETE', resource.uri).respond(200, '');
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
				expect(resource.uri).toEqual(serializable.uri);
				expect(resource.message).not.toBeDefined();
			});

		});

		describe('search', function () {

			beforeEach(function () {
				resource.getBaseUri = function () {
					return '/resource';
				};
				AbstractResource.prototype.fromSerializable = function (serializable) {
					this.uri = serializable.uri;
				};
			});

			it('should search without callbacks', function () {
				$httpBackend.expect('GET', resource.getBaseUri()).respond(200, [{
					uri: 1
				}]);
				var results = resource.search();
				expect(results).toEqual([]);
				$httpBackend.flush();
				expect(results.length).toEqual(1);
				expect(results[0] instanceof AbstractResource).toBeTruthy();
				expect(results[0].uri).toEqual(1);
			});

			it('should search with success', function () {
				$httpBackend.expect('GET', resource.getBaseUri()).respond(200, [{
					uri: 1
				}]);
				var results = resource.search(success, error);
				expect(results).toEqual([]);
				expect(success).not.toHaveBeenCalled();
				expect(error).not.toHaveBeenCalled();
				$httpBackend.flush();
				expect(results.length).toEqual(1);
				expect(results[0] instanceof AbstractResource).toBeTruthy();
				expect(results[0].uri).toEqual(1);
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
