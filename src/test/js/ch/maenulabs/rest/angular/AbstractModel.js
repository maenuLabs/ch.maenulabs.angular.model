/* global ch, angular, i18n:true, describe, it, beforeEach, expect, jasmine */
describe('AbstractModel', function () {

	var $injector = angular.injector(['ng', 'ngMockE2E', 'ch.maenulabs.rest.angular']);
	var AbstractModel = $injector.get('ch.maenulabs.rest.angular.AbstractModel');
	var ExistenceCheck = ch.maenulabs.validation.ExistenceCheck;
	var $httpBackend = $injector.get('$httpBackend');

	var model = null;

	beforeEach(function () {
		model = new AbstractModel();
	});

	describe('static', function () {

		it('should create statically with fromSerializable', function () {
			model = AbstractModel.fromSerializable({
				uri: 1
			});
			expect(model instanceof AbstractModel).toBeTruthy();
			expect(model.uri).toEqual(1);
		});

		it('should create statically with fromJson', function () {
			model = AbstractModel.fromJson('{"uri":1}');
			expect(model instanceof AbstractModel).toBeTruthy();
			expect(model.uri).toEqual(1);
		});

	});

	it('should have a validation and a nulled uri', function () {
		expect(model.uri).not.toBeDefined();
		expect(model.validation).toBeDefined();
	});

	describe('URIs', function () {

		it('should not implement getBaseUri', function () {
			expect(function () {
				model.getBaseUri();
			}).toThrow('not implemented');
		});
	});

	describe('serializable', function () {

		it('should implement toSerializable', function () {
			var uri = 1;
			model.uri = uri;
			var serializable = model.toSerializable();
			expect(serializable.uri).toEqual(uri);
		});

		it('should implement fromSerializable', function () {
			var serializable = {
				uri: 1
			};
			model.fromSerializable(serializable);
			expect(model.uri).toEqual(serializable.uri);
		});

	});

	describe('constructor', function () {

		it('should use the intial values', function () {
			var values = {
				a: 1,
				b: 2
			};
			model = new AbstractModel(values);
			expect(model.a).toEqual(1);
			expect(model.b).toEqual(2);
		});

		it('should override the intial values', function () {
			var values = {
				uri: 1,
				validation: 2
			};
			model = new AbstractModel(values);
			expect(model.uri).toEqual(1);
			expect(model.validation).toEqual(2);
		});

	});

	describe('validation', function () {

		it('should have no errors', function () {
			expect(model.hasErrors()).toBeFalsy();
			expect(model.getErrors()).toEqual({});
			expect(model.hasError('a')).toBeFalsy();
			expect(model.getError('a')).toEqual([]);
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
			model = new AbstractModel({
				a: null,
				b: 1
			});
			model.validation.add(new ExistenceCheck('a'));
			expect(model.hasErrors()).toBeTruthy();
			expect(model.getErrors()).toEqual({
				a: [message]
			});
			expect(model.hasError('a')).toBeTruthy();
			expect(model.getError('a')).toEqual([message]);
			expect(model.hasError('b')).toBeFalsy();
			expect(model.getError('b')).toEqual([]);
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
			model.toSerializable = jasmine.createSpy().andReturn(serializable);
			var json = model.toJson();
			expect(model.toSerializable).toHaveBeenCalled();
			expect(json).toEqual(angular.toJson(serializable));
		});

		it('should deserialize the serializable from fromJson', function () {
			model.fromSerializable = jasmine.createSpy();
			model.fromJson(angular.toJson(serializable));
			expect(model.fromSerializable).toHaveBeenCalledWith(serializable);
		});

	});

	describe('crud', function () {

		var baseUri = null;
		var serializable = null;
		var success = null;
		var error = null;

		beforeEach(function () {
			baseUri = 'model';
			serializable = {
				uri: 1,
				message: 'hello'
			};
			model.getBaseUri = jasmine.createSpy().andReturn(baseUri);
			model.fromSerializable = function (serializable) {
				this.uri = serializable.uri;
				this.message = serializable.message;
			};
			model.toSerializable = function () {
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
				model.message = serializable.message;
			});

			it('should create without callbacks', function () {
				$httpBackend.expect('POST', baseUri).respond({
					uri: serializable.uri,
					message: serializable.message
				});
				expect(model.create()).toBe(model);
				$httpBackend.flush();
				expect(model.uri).toEqual(serializable.uri);
				expect(model.message).toEqual(serializable.message);
			});

			it('should create with success', function () {
				$httpBackend.expect('POST', baseUri).respond({
					uri: serializable.uri,
					message: serializable.message
				});
				expect(model.create(success, error)).toBe(model);
				expect(success).not.toHaveBeenCalled();
				expect(error).not.toHaveBeenCalled();
				$httpBackend.flush();
				expect(success).toHaveBeenCalled();
				expect(error).not.toHaveBeenCalled();
				expect(model.uri).toEqual(serializable.uri);
				expect(model.message).toEqual(serializable.message);
			});

			it('should create with error', function () {
				$httpBackend.expect('POST', baseUri).respond(403, '');
				expect(model.create(success, error)).toBe(model);
				expect(success).not.toHaveBeenCalled();
				expect(error).not.toHaveBeenCalled();
				$httpBackend.flush();
				expect(success).not.toHaveBeenCalled();
				expect(error).toHaveBeenCalled();
				expect(model.uri).not.toBeDefined();
				expect(model.message).toEqual(serializable.message);
			});

		});

		describe('read', function () {

			beforeEach(function () {
				model.uri = serializable.uri;
			});

			it('should read without callbacks', function () {
				$httpBackend.expect('GET', model.uri).respond({
					uri: serializable.uri,
					message: serializable.message
				});
				expect(model.read()).toBe(model);
				$httpBackend.flush();
				expect(model.uri).toEqual(serializable.uri);
				expect(model.message).toEqual(serializable.message);
			});

			it('should read with success', function () {
				$httpBackend.expect('GET', model.uri).respond({
					uri: serializable.uri,
					message: serializable.message
				});
				expect(model.read(success, error)).toBe(model);
				expect(success).not.toHaveBeenCalled();
				expect(error).not.toHaveBeenCalled();
				$httpBackend.flush();
				expect(success).toHaveBeenCalled();
				expect(error).not.toHaveBeenCalled();
				expect(model.uri).toEqual(serializable.uri);
				expect(model.message).toEqual(serializable.message);
			});

			it('should read with error', function () {
				$httpBackend.expect('GET', model.uri).respond(404, '');
				expect(model.read(success, error)).toBe(model);
				expect(success).not.toHaveBeenCalled();
				expect(error).not.toHaveBeenCalled();
				$httpBackend.flush();
				expect(success).not.toHaveBeenCalled();
				expect(error).toHaveBeenCalled();
				expect(model.uri).toEqual(serializable.uri);
				expect(model.message).not.toBeDefined();
			});

		});

		describe('update', function () {

			var message = 'hello hello';

			beforeEach(function () {
				model.uri = serializable.uri;
				model.message = message;
			});

			it('should update without callbacks', function () {
				$httpBackend.expect('PUT', model.uri).respond({
					uri: serializable.uri,
					message: serializable.message
				});
				expect(model.update()).toBe(model);
				$httpBackend.flush();
				expect(model.uri).toEqual(serializable.uri);
				expect(model.message).toEqual(message);
			});

			it('should update with success', function () {
				$httpBackend.expect('PUT', model.uri).respond({
					uri: model.uri,
					message: model.message
				});
				expect(model.update(success, error)).toBe(model);
				expect(success).not.toHaveBeenCalled();
				expect(error).not.toHaveBeenCalled();
				$httpBackend.flush();
				expect(success).toHaveBeenCalled();
				expect(error).not.toHaveBeenCalled();
				expect(model.uri).toEqual(serializable.uri);
				expect(model.message).toEqual(message);
			});

			it('should update with error', function () {
				$httpBackend.expect('PUT', serializable.uri).respond(403, '');
				expect(model.update(success, error)).toBe(model);
				expect(success).not.toHaveBeenCalled();
				expect(error).not.toHaveBeenCalled();
				$httpBackend.flush();
				expect(success).not.toHaveBeenCalled();
				expect(error).toHaveBeenCalled();
				expect(model.uri).toEqual(serializable.uri);
				expect(model.message).toEqual(message);
			});

		});

		describe('remove', function () {

			beforeEach(function () {
				model.uri = serializable.uri;
			});

			it('should remove without callbacks', function () {
				$httpBackend.expect('DELETE', model.uri).respond(200, '');
				expect(model.remove()).toBe(model);
				$httpBackend.flush();
				expect(model.uri).toBeNull();
			});

			it('should remove with success', function () {
				$httpBackend.expect('DELETE', model.uri).respond(200, '');
				expect(model.remove(success, error)).toBe(model);
				expect(success).not.toHaveBeenCalled();
				expect(error).not.toHaveBeenCalled();
				$httpBackend.flush();
				expect(success).toHaveBeenCalled();
				expect(error).not.toHaveBeenCalled();
				expect(model.uri).toBeNull();
			});

			it('should remove with error', function () {
				$httpBackend.expect('DELETE', model.uri).respond(404, '');
				expect(model.remove(success, error)).toBe(model);
				expect(success).not.toHaveBeenCalled();
				expect(error).not.toHaveBeenCalled();
				$httpBackend.flush();
				expect(success).not.toHaveBeenCalled();
				expect(error).toHaveBeenCalled();
				expect(model.uri).toEqual(serializable.uri);
				expect(model.message).not.toBeDefined();
			});

		});

		describe('search', function () {

			beforeEach(function () {
				model.getBaseUri = function () {
					return '/model';
				};
				AbstractModel.prototype.fromSerializable = function (serializable) {
					this.uri = serializable.uri;
				};
			});

			it('should search without callbacks', function () {
				$httpBackend.expect('GET', model.getBaseUri()).respond(200, [{
					uri: 1
				}]);
				var results = model.search();
				expect(results).toEqual([]);
				$httpBackend.flush();
				expect(results.length).toEqual(1);
				expect(results[0] instanceof AbstractModel).toBeTruthy();
				expect(results[0].uri).toEqual(1);
			});

			it('should search with success', function () {
				$httpBackend.expect('GET', model.getBaseUri()).respond(200, [{
					uri: 1
				}]);
				var results = model.search(success, error);
				expect(results).toEqual([]);
				expect(success).not.toHaveBeenCalled();
				expect(error).not.toHaveBeenCalled();
				$httpBackend.flush();
				expect(results.length).toEqual(1);
				expect(results[0] instanceof AbstractModel).toBeTruthy();
				expect(results[0].uri).toEqual(1);
				expect(success).toHaveBeenCalled();
				expect(error).not.toHaveBeenCalled();
			});

			it('should search with error', function () {
				$httpBackend.expect('GET', model.getBaseUri()).respond(403, '');
				var results = model.search(success, error);
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
