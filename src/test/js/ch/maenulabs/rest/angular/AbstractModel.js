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
				id: 1
			});
			expect(model instanceof AbstractModel).toBeTruthy();
			expect(model.id).toEqual(1);
		});

		it('should create statically with fromJson', function () {
			model = AbstractModel.fromJson('{"id":1}');
			expect(model instanceof AbstractModel).toBeTruthy();
			expect(model.id).toEqual(1);
		});

	});

	it('should have a validation and a nulled id', function () {
		expect(model.id).not.toBeDefined();
		expect(model.validation).toBeDefined();
	});

	describe('paths', function () {

		it('should not implement getBasePath', function () {
			expect(function () {
				model.getBasePath();
			}).toThrow('not implemented');
		});

		it('should not implement getSearchPath', function () {
			expect(function () {
				model.getSearchPath();
			}).toThrow('not implemented');
		});

	});

	describe('permissions', function () {

		it('should not implement canBeCreated', function () {
			expect(function () {
				model.canBeCreated();
			}).toThrow('not implemented');
		});

		it('should not implement canBeRead', function () {
			expect(function () {
				model.canBeRead();
			}).toThrow('not implemented');
		});

		it('should not implement canBeUpdated', function () {
			expect(function () {
				model.canBeUpdated();
			}).toThrow('not implemented');
		});

		it('should not implement canBeRemoved', function () {
			expect(function () {
				model.canBeRemoved();
			}).toThrow('not implemented');
		});

	});

	describe('serializable', function () {

		it('should implement toSerializable', function () {
			var id = 1;
			model.id = id;
			var serializable = model.toSerializable();
			expect(serializable.id).toEqual(id);
		});

		it('should implement fromSerializable', function () {
			var serializable = {
				id: 1
			};
			model.fromSerializable(serializable);
			expect(model.id).toEqual(serializable.id);
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
				id: 1,
				validation: 2
			};
			model = new AbstractModel(values);
			expect(model.id).toEqual(1);
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

		var basePath = null;
		var serializable = null;
		var success = null;
		var error = null;

		beforeEach(function () {
			basePath = 'model';
			serializable = {
				id: 1,
				message: 'hello'
			};
			model.getBasePath = jasmine.createSpy().andReturn(basePath);
			model.fromSerializable = function (serializable) {
				this.id = serializable.id;
				this.message = serializable.message;
			};
			model.toSerializable = function () {
				return {
					id: this.id,
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
				$httpBackend.expect('POST', basePath).respond({
					id: serializable.id,
					message: serializable.message
				});
				expect(model.create()).toBe(model);
				$httpBackend.flush();
				expect(model.id).toEqual(serializable.id);
				expect(model.message).toEqual(serializable.message);
			});

			it('should create with success', function () {
				$httpBackend.expect('POST', basePath).respond({
					id: serializable.id,
					message: serializable.message
				});
				expect(model.create(success, error)).toBe(model);
				expect(success).not.toHaveBeenCalled();
				expect(error).not.toHaveBeenCalled();
				$httpBackend.flush();
				expect(success).toHaveBeenCalled();
				expect(error).not.toHaveBeenCalled();
				expect(model.id).toEqual(serializable.id);
				expect(model.message).toEqual(serializable.message);
			});

			it('should create with error', function () {
				$httpBackend.expect('POST', basePath).respond(403, '');
				expect(model.create(success, error)).toBe(model);
				expect(success).not.toHaveBeenCalled();
				expect(error).not.toHaveBeenCalled();
				$httpBackend.flush();
				expect(success).not.toHaveBeenCalled();
				expect(error).toHaveBeenCalled();
				expect(model.id).not.toBeDefined();
				expect(model.message).toEqual(serializable.message);
			});

		});

		describe('read', function () {

			beforeEach(function () {
				model.id = serializable.id;
			});

			it('should read without callbacks', function () {
				$httpBackend.expect('GET', basePath + '/' + model.id).respond({
					id: serializable.id,
					message: serializable.message
				});
				expect(model.read()).toBe(model);
				$httpBackend.flush();
				expect(model.id).toEqual(serializable.id);
				expect(model.message).toEqual(serializable.message);
			});

			it('should read with success', function () {
				$httpBackend.expect('GET', basePath + '/' + model.id).respond({
					id: serializable.id,
					message: serializable.message
				});
				expect(model.read(success, error)).toBe(model);
				expect(success).not.toHaveBeenCalled();
				expect(error).not.toHaveBeenCalled();
				$httpBackend.flush();
				expect(success).toHaveBeenCalled();
				expect(error).not.toHaveBeenCalled();
				expect(model.id).toEqual(serializable.id);
				expect(model.message).toEqual(serializable.message);
			});

			it('should read with error', function () {
				$httpBackend.expect('GET', basePath + '/' + model.id).respond(404, '');
				expect(model.read(success, error)).toBe(model);
				expect(success).not.toHaveBeenCalled();
				expect(error).not.toHaveBeenCalled();
				$httpBackend.flush();
				expect(success).not.toHaveBeenCalled();
				expect(error).toHaveBeenCalled();
				expect(model.id).toEqual(serializable.id);
				expect(model.message).not.toBeDefined();
			});

		});

		describe('update', function () {

			var message = 'hello hello';

			beforeEach(function () {
				model.id = serializable.id;
				model.message = message;
			});

			it('should update without callbacks', function () {
				$httpBackend.expect('PUT', basePath + '/' + model.id).respond({
					id: serializable.id,
					message: serializable.message
				});
				expect(model.update()).toBe(model);
				$httpBackend.flush();
				expect(model.id).toEqual(serializable.id);
				expect(model.message).toEqual(message);
			});

			it('should update with success', function () {
				$httpBackend.expect('PUT', basePath + '/' + model.id).respond({
					id: model.id,
					message: model.message
				});
				expect(model.update(success, error)).toBe(model);
				expect(success).not.toHaveBeenCalled();
				expect(error).not.toHaveBeenCalled();
				$httpBackend.flush();
				expect(success).toHaveBeenCalled();
				expect(error).not.toHaveBeenCalled();
				expect(model.id).toEqual(serializable.id);
				expect(model.message).toEqual(message);
			});

			it('should update with error', function () {
				$httpBackend.expect('PUT', basePath + '/' + serializable.id).respond(403, '');
				expect(model.update(success, error)).toBe(model);
				expect(success).not.toHaveBeenCalled();
				expect(error).not.toHaveBeenCalled();
				$httpBackend.flush();
				expect(success).not.toHaveBeenCalled();
				expect(error).toHaveBeenCalled();
				expect(model.id).toEqual(serializable.id);
				expect(model.message).toEqual(message);
			});

		});

		describe('remove', function () {

			beforeEach(function () {
				model.id = serializable.id;
			});

			it('should remove without callbacks', function () {
				$httpBackend.expect('DELETE', basePath + '/' + model.id).respond(200, '');
				expect(model.remove()).toBe(model);
				$httpBackend.flush();
				expect(model.id).toBeNull();
			});

			it('should remove with success', function () {
				$httpBackend.expect('DELETE', basePath + '/' + model.id).respond(200, '');
				expect(model.remove(success, error)).toBe(model);
				expect(success).not.toHaveBeenCalled();
				expect(error).not.toHaveBeenCalled();
				$httpBackend.flush();
				expect(success).toHaveBeenCalled();
				expect(error).not.toHaveBeenCalled();
				expect(model.id).toBeNull();
			});

			it('should remove with error', function () {
				$httpBackend.expect('DELETE', basePath + '/' + model.id).respond(404, '');
				expect(model.remove(success, error)).toBe(model);
				expect(success).not.toHaveBeenCalled();
				expect(error).not.toHaveBeenCalled();
				$httpBackend.flush();
				expect(success).not.toHaveBeenCalled();
				expect(error).toHaveBeenCalled();
				expect(model.id).toEqual(serializable.id);
				expect(model.message).not.toBeDefined();
			});

		});

		describe('search', function () {

			beforeEach(function () {
				model.getSearchPath = function () {
					return this.getBasePath() + '/search';
				};
				AbstractModel.prototype.fromSerializable = function (serializable) {
					this.id = serializable.id;
				};
			});

			it('should search without callbacks', function () {
				$httpBackend.expect('GET', model.getBasePath() + '/search').respond(200, [{
					id:1
				}]);
				var results = model.search();
				expect(results).toEqual([]);
				$httpBackend.flush();
				expect(results.length).toEqual(1);
				expect(results[0] instanceof AbstractModel).toBeTruthy();
				expect(results[0].id).toEqual(1);
			});

			it('should search with success', function () {
				$httpBackend.expect('GET', model.getBasePath() + '/search').respond(200, [{
					id:1
				}]);
				var results = model.search(success, error);
				expect(results).toEqual([]);
				expect(success).not.toHaveBeenCalled();
				expect(error).not.toHaveBeenCalled();
				$httpBackend.flush();
				expect(results.length).toEqual(1);
				expect(results[0] instanceof AbstractModel).toBeTruthy();
				expect(results[0].id).toEqual(1);
				expect(success).toHaveBeenCalled();
				expect(error).not.toHaveBeenCalled();
			});

			it('should search with error', function () {
				$httpBackend.expect('GET', model.getBasePath() + '/search').respond(403, '');
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
